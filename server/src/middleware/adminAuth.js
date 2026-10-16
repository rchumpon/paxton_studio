// Import JWT to verify authentication tokens
const jwt = require("jsonwebtoken");

// Import application configuration
const config = require("../config/config");

module.exports = {
  // -------------------------------------
  // Verify administrator authentication
  // -------------------------------------

  async adminAuth(req, res, next) {
    try {
      // Get the token from the custom "token" header
      const { token } = req.headers;

      // Check if the token exists
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Not Authorized. Please Log in again",
        });
      }

      // Verify the token using the same secret used to sign it
      const decoded = jwt.verify(token, config.authentication.jwtSecret);

      // Check whether the authenticated user is an admin
      if (
        decoded.role !== "admin" ||
        decoded.email !== process.env.ADMIN_EMAIL
      ) {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      // Store the authenticated admin information
      req.admin = decoded;

      // Allow the request to continue to the controller
      return next();
    } catch (err) {
      console.error("Admin Authentication Error:", err);

      // Handle invalid or expired JWT tokens
      if (
        err.name === "JsonWebTokenError" ||
        err.name === "TokenExpiredError" ||
        err.name === "NotBeforeError"
      ) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token. Please log in again",
        });
      }

      return next(err);
    }
  },
};
