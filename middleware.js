const jwt = require("jsonwebtoken");
const Admin = require("./models/admin");
const Customer = require("./models/user"); // Adjust paths based on your project structure

// Middleware to check if user is logged in (either admin or customer)
exports.isLoggedIn = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.redirect("/users/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;

    if (decoded.adminId) {
      // If adminId is in token, find the admin
      user = await Admin.findById(decoded.adminId);
      req.userType = "admin";
    } else if (decoded.customerId) {
      // If customerId is in token, find the customer
      user = await Customer.findById(decoded.customerId);
      req.userType = "customer";
    }

    if (!user) {
      return res.redirect("/users/login");
    }
    req.user = user; // Sets req.user for either admin or customer
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.redirect("/users/login");
  }
};

// Middleware to ensure user is an admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.userType === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin privileges required" });
  }
};

// Middleware to ensure user is a customer
exports.isCustomer = (req, res, next) => {
  if (req.user && req.userType === "customer") {
    next();
  } else {
    res.status(403).json({ message: "Customer privileges required" });
  }
};
