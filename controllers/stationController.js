const Station = require("../models/station");

// Get all stations
exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.find();
    res.status(200).json(stations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stations" });
  }
};

// Add a new station
exports.addStation = async (req, res) => {
  const { name, code, location } = req.body;
  try {
    const newStation = new Station({ name, code, location });
    await newStation.save();
    res.status(201).json({ message: "Station added successfully", newStation });
  } catch (error) {
    res.status(500).json({ message: "Error adding station" });
  }
};

// Update an existing station
exports.updateStation = async (req, res) => {
  const { stationId } = req.params;
  const { name, code, location } = req.body;
  try {
    const station = await Station.findByIdAndUpdate(
      stationId,
      { name, code, location },
      { new: true } // Returns the updated document
    );

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.status(200).json({ message: "Station updated successfully", station });
  } catch (error) {
    res.status(500).json({ message: "Error updating station" });
  }
};

// Delete a station
exports.deleteStation = async (req, res) => {
  const { stationId } = req.params;
  try {
    const station = await Station.findByIdAndDelete(stationId);

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.status(200).json({ message: "Station deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting station" });
  }
};

// Get a single station by ID
exports.getStationById = async (req, res) => {
  const { stationId } = req.params;
  try {
    const station = await Station.findById(stationId);

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.status(200).json(station);
  } catch (error) {
    res.status(500).json({ message: "Error fetching station" });
  }
};
