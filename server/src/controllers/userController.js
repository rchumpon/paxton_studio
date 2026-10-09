// Import custom error handler
const ApiError = require("../utilities/ApiError");
// Import JWT token utility
const { jwtSignUser } = require("../utilities/authServices");

module.exports = {
  // ----------------------------------
  // Admin Login
  // POST /api/admin/login
  // ----------------------------------

  async adminLogin(req, res, next) {
    try {
      // Get email and password from the request body
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        return next(ApiError.badRequest("Email and password are required"));
      }

      // Compare login credentials with environment variables
      if (
        email !== process.env.ADMIN_EMAIL &&
        password !== process.env.ADMIN_PASSWORD
      ) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Create admin information for the JWT payload
      const admin = {
        email,
        role: "admin",
      };

      // Generate JWT using our existing utility
      const token = jwtSignUser(admin);

      // Return the JWT token
      return res
        .status(200)
        .json({ success: true, message: "Admin login successful", token });
    } catch (err) {
      console.error("Admin Login Error", err);
      return next(ApiError.internal("Admin login failed at this time...", err));
    }
  },
};
