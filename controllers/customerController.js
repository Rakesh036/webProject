const Customer = require("../models/user");
const Ticket = require("../models/ticket");
const Train = require("../models/train");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Render Registration Form
exports.renderRegister = (req, res) => {
  res.render("customer/register");
};

// Register a Customer
exports.registerCustomer = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({ name, email, password: hashedPassword });
    await newCustomer.save();
    res.redirect("/users/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering customer" });
  }
};

// Render Login Form
exports.renderLogin = (req, res) => {
  res.render("customer/login");
};

// Login Customer
exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email });
    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ customerId: customer._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("authToken", token, { httpOnly: true, maxAge: 3600000 });
    res.redirect("/users/tickets");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

// Logout Customer
exports.logoutCustomer = (req, res) => {
  res.clearCookie("authToken");
  res.redirect("/users/login");
};

// Render Train Search Form
exports.renderTrainSearch = (req, res) => {
  res.render("customer/searchTrain");
};

// Search for Trains
// Search for Trains
exports.searchTrains = async (req, res) => {
  const { startStation, endStation, date } = req.query;
  try {
    // Search for trains based on the given criteria
    const trains = await Train.find({
      startStation,
      endStation, // Ensure there are available seats
    });

    // Render the searchTrain view and pass the trains to it
    res.render("customer/selectTrain", { trains });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching for trains" });
  }
};

// List All Booked Tickets
// List All Booked Tickets
exports.index = async (req, res) => {
  try {
    console.log(req.user); // Check if req.user is populated correctly
    
    // Correcting the field name to "train" for populating
    const tickets = await Ticket.find({ user: req.user._id }).populate("train");
    
    // Check if tickets are fetched properly
    console.log(tickets);
    
    // If tickets are found, render the tickets page
    res.render("customer/index", { tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
};


// Show Form for New Ticket Booking
exports.new = async (req, res) => {
  const { trainId } = req.query;
  try {
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }
    res.render("customer/new", { train });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error loading booking form" });
  }
};

// Create a new ticket booking
// Create a New Ticket Booking
exports.createTicket = async (req, res) => {
  const { trainId, seatCount, journeyDate, passengers, startStation, endStation } = req.body;
  
  try {
    const train = await Train.findById(trainId);
    if (!train || train.seatsAvailable < seatCount) {
      return res.status(400).json({ message: "Insufficient seats available" });
    }

    // Ensure the number of passengers matches the seat count
    if (passengers.length !== parseInt(seatCount)) {
      return res.status(400).json({ message: "The number of passengers must match the number of seats" });
    }

    // Ensure start and end stations match the train's route (optional validation)
    if (train.startStation !== startStation || train.endStation !== endStation) {
      return res.status(400).json({ message: "Start or End station does not match the train's route" });
    }

    // Create a new ticket
    const newTicket = new Ticket({
      train: trainId,
      user: req.user._id,
      passengers,
      seats: seatCount,
      date: journeyDate, // Save the date of journey
      startStation,  // Save start station
      endStation,    // Save end station
    });

    await newTicket.save();

    // Update train seats available
    train.seatsAvailable -= seatCount;
    await train.save();

    // Redirect to user ticket list
    res.redirect("/users/tickets");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking ticket" });
  }
};
// Show Ticket Details
exports.show = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("trainId");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.render("customer/show", { ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching ticket details" });
  }
};

// Show Form for Editing Ticket
exports.edit = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("trainId");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.render("customer/edit", { ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching ticket for edit" });
  }
};

// Update Ticket
exports.update = async (req, res) => {
  const { seatCount } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id).populate("trainId");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const train = ticket.trainId;
    const seatDifference = seatCount - ticket.seatCount;

    if (seatDifference > 0 && train.seatsAvailable < seatDifference) {
      return res.status(400).json({ message: "Insufficient seats available" });
    }

    ticket.seatCount = seatCount;
    await ticket.save();

    train.seatsAvailable -= seatDifference;
    await train.save();

    res.redirect(`/users/tickets/${ticket._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating ticket" });
  }
};
