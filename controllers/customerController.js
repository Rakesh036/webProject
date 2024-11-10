const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Train = require("../models/train");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, { httpOnly: true, maxAge: 3600000 });
    res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "User logged out successfully" });
};

exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

exports.searchTrains = async (req, res) => {
  const { startStation, endStation } = req.query;
  try {
    if (!startStation || !endStation) {
      return res
        .status(400)
        .json({ message: "Start and end stations are required" });
    }

    const trains = await Train.find({ startStation, endStation });
    if (trains.length === 0) {
      return res.status(404).json({ message: "No trains found" });
    }

    res.status(200).json({ trains });
  } catch (error) {
    res.status(500).json({ message: "Error searching for trains", error });
  }
};
