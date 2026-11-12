const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

// Import authentication middleware
const { adminAuth } = require("../middleware/adminAuth");
const { userAuth } = require("../middleware/userAuth");

module.exports = () => {
  // Admin features
  router.post("/list", adminAuth, orderController.allOrders);
  router.post("/status", adminAuth, orderController.updateStatus);

  // Payment features
  router.post("/place", userAuth, orderController.placeOrder);
  router.post("/stripe", userAuth, orderController.placeOrderStripe);
  router.post("/razorpay", userAuth, orderController.placeOrderRazorpay);

  // User Features
  router.post("/userorders", userAuth, orderController.userOrders);

  return router;
};
