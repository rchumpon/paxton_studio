//=============================================
// User Authentication Middleware
// Verifies JWT tokens for protected routes
//=============================================

// Import JWT to verify authentication tokens
const jwt = require("jsonwebtoken");

// Import application configuration
const config = require("../config/config");

module.exports = {
  async userAuth(req, res, next) {
    // Get the JWT token from request headers
    const { token } = req.headers;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please Log in again",
      });
    }

    try {
      // Verify the token using the same secret used to sign it
      const tokenDecoded = jwt.verify(token, config.authentication.jwtSecret);

      console.log("Decoded User ID:", tokenDecoded.id);

      // Store the authenticated user's ID in the request
      req.userId = tokenDecoded.id;
      return next();
    } catch (err) {
      console.error("User Authentication Error:", err.message);

      // Return an unauthorized response
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please log in again",
      });
    }
  },
};
