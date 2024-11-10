const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const stationRoutes = require("./routes/stationRoutes");
const trainRoutes = require("./routes/trainRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const userRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // This ensures that req.body will contain parsed JSON data
app.use(express.urlencoded({ extended: true })); // This ensures that req.body will contain URL-encoded data
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/railwayDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", (req, res) => res.render("index"));

// Routes
app.use("/stations", stationRoutes);
app.use("/trains", trainRoutes);
app.use("/tickets", ticketRoutes);
app.use("/users", userRoutes);

// Admin Routes (middleware logging)
app.use("/admin",adminRoutes);

// Public routes
app.get("/invalid-credentials", (req, res) =>
  res.render("invalid-credentials")
);
app.get("/error-page", (req, res) => res.render("error-page"));
app.get("/customer-search-trains", (req, res) =>
  res.render("customer-search-trains")
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
