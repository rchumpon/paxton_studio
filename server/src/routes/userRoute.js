const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// Import authentication middleware
const { userAuth } = require("../middleware/userAuth");

module.exports = () => {
  router.post("/admin", userController.adminLogin);

  // Get logged-in customer profile
  router.get("/profile", userAuth, userController.getUserProfile);

  return router;
};
