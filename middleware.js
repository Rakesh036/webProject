const jwt = require("jsonwebtoken");
const Admin = require("./models/admin"); // Adjust path based on your structure

// Middleware to check if user is logged in
exports.isLoggedIn = (req, res, next) => {
  const token = req.cookies.authToken; // Assumes token is stored in cookies
  if (!token) {
    return res.status(401).json({ message: "Please log in to access this resource" });
  }

  try {
    // Verify token and attach user ID to request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.adminId;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ message: "Invalid token, please log in again" });
  }
};

// Middleware to check if logged-in user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
  } catch (error) {
    console.error("Admin check failed:", error);
    res.status(500).json({ message: "Error verifying admin access" });
  }
};
