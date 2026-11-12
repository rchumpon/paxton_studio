const express = require("express");
// Router instance of app (express)
const router = express.Router();

// Import route modules
const authRoute = require("./authRoute");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");

// Endpoints for "/" path
module.exports = () => {
  // Home/Test Endpoint - GET: /api
  router.get("/", (req, res, next) => {
    res.send("Welcome to Paxton Studio API");
  });

  // Authentication routes: api/auth
  router.use("/auth", authRoute());

  // Product routes: /api/product
  router.use("/product", productRoute());

  router.use("/user", userRoute());

  router.use("/cart", cartRoute());

  router.use("/order", orderRoute());

  return router;
};
