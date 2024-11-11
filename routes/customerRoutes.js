// customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { isLoggedIn } = require("../middleware");
const Ticket = require("../models/ticket");

router.get("/register", customerController.renderRegister);
router.post("/register", customerController.registerCustomer);

router.get("/login", customerController.renderLogin);
router.post("/login", customerController.loginCustomer);
router.get("/logout", customerController.logoutCustomer);

router.get("/tickets", isLoggedIn, customerController.index);
router.get("/tickets/new", isLoggedIn, customerController.new);
router.post("/tickets", isLoggedIn, customerController.createTicket);


router.get('/tickets/delete/:id', async (req, res) => {
    try {
      const ticket = await Ticket.findByIdAndDelete(req.params.id);
      
      if (!ticket) {
        return res.status(404).send('Ticket not found');
      }
  
      res.redirect('/users/tickets');  // Redirect to the ticket list page after deletion
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });


router.get("/tickets/search", isLoggedIn, customerController.renderTrainSearch);
router.get("/tickets/:id", isLoggedIn, customerController.show);
router.get("/tickets/:id/edit", isLoggedIn, customerController.edit);
router.put("/tickets/:id", isLoggedIn, customerController.update);

router.get("/trains/search", isLoggedIn, customerController.searchTrains);


// Cancel Ticket Route
router.post('/tickets/cancel/:id', async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      
      if (!ticket) {
        return res.status(404).send('Ticket not found');
      }
  
      if (ticket.status === 'cancelled') {
        return res.status(400).send('This ticket is already cancelled');
      }
  
      // Cancel the ticket by updating its status
      ticket.status = 'cancelled';
      await ticket.save();
  
      res.redirect('/users/tickets');  // Redirect to the ticket list page after cancellation
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});
  

module.exports = router;
