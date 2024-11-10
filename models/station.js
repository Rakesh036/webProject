// models/Station.js
const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  // Additional fields for coordinates or other details if necessary
});

module.exports = mongoose.model("Station", stationSchema);
