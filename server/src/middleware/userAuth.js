// Import JWT to verify authentication tokens
const jwt = require("jsonwebtoken");

module.exports = {
  async authUser(req, res, next) {
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

    }
  },
};
