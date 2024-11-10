const Admin = require("../models/admin");
const Train = require("../models/train");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Admin Registration
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering admin" });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("authToken", token, { httpOnly: true, maxAge: 3600000 });
    console.log("Login successful");
    res.redirect("/admin/trains"); // Redirects to the route showing all trains
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

// Show All Trains
exports.getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    res.render("admin/index", { trains });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching trains" });
  }
};

// Show Train Details
exports.showTrain = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ message: "Train not found" });
    res.render("admin/show", { train });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching train details" });
  }
};

// Add a New Train
exports.addTrain = async (req, res) => {
  const { trainNumber, name, startStation, endStation, seatsAvailable } = req.body;
  try {
    const newTrain = new Train({ trainNumber, name, startStation, endStation, seatsAvailable });
    await newTrain.save();
    console.log("Train added successfully");
    res.redirect("/admin/trains"); // Redirects to the route showing all trains
  } catch (error) {
    console.error("Error adding train:", error);
    res.status(500).json({ message: "Error adding train" });
  }
};

// Get Train Details for Editing
exports.getTrainForEdit = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ message: "Train not found" });
    res.render("admin/edit", { train });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching train for edit" });
  }
};

// Edit Train Details
exports.editTrain = async (req, res) => {
  const { trainNumber, name, startStation, endStation, seatsAvailable } = req.body;
  try {
    const train = await Train.findByIdAndUpdate(
      req.params.id,
      { trainNumber, name, startStation, endStation, seatsAvailable },
      { new: true }
    );
    if (!train) return res.status(404).json({ message: "Train not found" });
    console.log("Train updated successfully");
    res.redirect("/admin/trains"); // Redirects to the route showing all trains
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating train" });
  }
};

// Delete Train
exports.deleteTrain = async (req, res) => {
  try {
    const train = await Train.findByIdAndDelete(req.params.id);
    if (!train) return res.status(404).json({ message: "Train not found" });
    console.log("Train deleted successfully");
    res.redirect("/admin/trains"); // Redirects to the route showing all trains
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting train" });
  }
};
