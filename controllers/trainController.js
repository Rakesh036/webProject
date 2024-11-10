const Train = require("../models/train");

exports.getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trains" });
  }
};
// Get a train by its ID
exports.getTrainById = async (req, res) => {
  const { trainId } = req.params;
  try {
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }
    res.json(train);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the train" });
  }
};
exports.addTrain = async (req, res) => {
  const { trainNumber, name, startStation, endStation, seatsAvailable } =
    req.body;
  try {
    const newTrain = new Train({
      trainNumber,
      name,
      startStation,
      endStation,
      seatsAvailable,
    });
    await newTrain.save();
    res.status(201).json({ message: "Train added successfully", newTrain });
  } catch (error) {
    res.status(500).json({ message: "Error adding train" });
  }
};

exports.deleteTrain = async (req, res) => {
  const { trainId } = req.body;
  try {
    const train = await Train.findByIdAndDelete(trainId);
    if (!train) return res.status(404).json({ message: "Train not found" });
    res.status(200).json({ message: "Train removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing train" });
  }
};

exports.updateSeats = async (req, res) => {
  const { trainId, seatsToAdd } = req.body;
  try {
    const train = await Train.findById(trainId);
    if (!train) return res.status(404).json({ message: "Train not found" });
    train.seatsAvailable += seatsToAdd;
    await train.save();
    res.status(200).json({ message: "Seats updated successfully", train });
  } catch (error) {
    res.status(500).json({ message: "Error updating seats" });
  }
};
