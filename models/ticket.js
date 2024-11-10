const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  train: { type: mongoose.Schema.Types.ObjectId, ref: "Train" },
  passengers: [
    {
      name: String,
      age: Number,
    },
  ],
  seats: {
    type: Number,
    required: true,
  },
  date: { type: Date, required: true },
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
});

module.exports = mongoose.model("Ticket", TicketSchema);
