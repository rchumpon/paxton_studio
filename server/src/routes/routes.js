const express = require("express");
// Router instance of app (express)
const router = express.Router();

// Import route modules
const authRoutes = require("./authRoute");
const productRoute = require("./productRoute");

// Endpoints for "/" path
module.exports = () => {
  // Home/Test Endpoint - GET: /api
  router.get("/", (req, res, next) => {
    res.send("Welcome to Paxton Studio API");
  });

  // Authentication routes: api/auth
  router.use("/auth", authRoutes());

  // Product routes: /api/product
  router.use("/product", productRoute());

  return router;
};
