const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isLoggedIn, isAdmin } = require("../middleware.js");

// Admin Registration (GET)
router.get("/register", (req, res) => res.render("admin/register"));

// Admin Registration (POST)
router.post("/register", adminController.registerAdmin);

// Admin Login (GET)
router.get("/login", (req, res) => res.render("admin/login"));

// Admin Login (POST)
router.post("/login", adminController.loginAdmin);

// Show All Trains
router.get("/trains",isLoggedIn, adminController.getAllTrains);

// Add New Train (GET form)
router.get("/trains/new", (req, res) => res.render("admin/new"));

// Add New Train (POST form submission)
router.post("/trains/new", adminController.addTrain);

// Edit Train (GET form)
router.get("/trains/edit/:id", adminController.getTrainForEdit);

// Edit Train (POST form submission)
router.post("/trains/edit/:id", adminController.editTrain);

// Show Train Details
router.get("/trains/show/:id", adminController.showTrain);

// Delete Train
router.get("/trains/delete/:id", adminController.deleteTrain);

module.exports = router;
