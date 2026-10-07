const express = require("express");
// Router instance of app (express)
const router = express.Router();

const authRoutes = require("./authRoute");

// Endpoints for "/" path
module.exports = () => {
  // Home/Test Endpoint
  router.get("/", (req, res, next) => {
    res.send("Welcome to Paxton Studio API");
  });

  // Auth routes: /api/auth
  router.use("/auth", authRoutes());
  return router;
};
