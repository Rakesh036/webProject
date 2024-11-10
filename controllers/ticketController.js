const Ticket = require("../models/ticket");

exports.bookTicket = async (req, res) => {
  const { userId, trainId, date, passengers } = req.body;
  try {
    const newTicket = new Ticket({
      user: userId,
      train: trainId,
      date,
      passengers,
    });
    await newTicket.save();
    res.status(201).json({ message: "Ticket booked successfully", newTicket });
  } catch (error) {
    res.status(500).json({ message: "Error booking ticket" });
  }
};

exports.cancelTicket = async (req, res) => {
  const { ticketId } = req.body;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    ticket.status = "cancelled";
    await ticket.save();
    res.status(200).json({ message: "Ticket cancelled successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling ticket" });
  }
};

exports.getUserTickets = async (req, res) => {
  const { customerId } = req.params;
  try {
    const tickets = await Ticket.find({ user: customerId });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tickets" });
  }
};
