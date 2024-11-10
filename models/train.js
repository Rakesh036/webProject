const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: true,
    // unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  startStation: {
    type: String,
    required: true,
  },
  endStation: {
    type:String,
    required: true,
  },
  stoppages: [
    {
      station: { type:String },
      arrivalTime: String,
      departureTime: String,
      sequence: Number, // Used for ordering the stations
    },
  ],
  seatsAvailable: {
    type: Number,
    default: 100,
  },
  dailyRun: {
    type: Boolean,
    default: true,
  },
});

// Pre-save hook to set default stoppages
trainSchema.pre("save", function (next) {
  if (this.isNew) {
    this.stoppages = [
      {
        station: this.startStation,
        arrivalTime: "N/A",
        departureTime: "Departure Time",
        sequence: 1, // Starting point
      },
      {
        station: this.endStation,
        arrivalTime: "Arrival Time",
        departureTime: "N/A",
        sequence: 2, // Ending point
      },
    ];
  }
  next();
});

module.exports = mongoose.model("Train", trainSchema);
