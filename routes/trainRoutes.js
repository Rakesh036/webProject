const express = require("express");
const router = express.Router();
const trainController = require("../controllers/trainController");

// Get all trains
router.get("/", trainController.getAllTrains);

// Add a new train
router.post("/", trainController.addTrain);

// Get a single train by ID
router.get("/:trainId", trainController.getTrainById);

// Update an existing train
router.put("/:trainId", trainController.updateSeats);

// Delete a train
router.delete("/:trainId", trainController.deleteTrain);
module.exports = router;
