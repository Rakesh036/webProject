const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

// Book a ticket
router.post("/book", ticketController.bookTicket);

// Get all tickets for a specific user
router.get("/user/:userId", ticketController.getUserTickets);

// Get a specific ticket by ID
// router.get("/:ticketId", ticketController.getTicketById);

// Cancel a ticket
router.delete("/:ticketId", ticketController.cancelTicket);

module.exports = router;
