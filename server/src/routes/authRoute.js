const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

module.exports = () => {
  // Auth Test Route: Lists all users (GET): /api/auth/users
  router.get("/users", authController.listUsers);

  // Auth: Register / Sign up (POST): /api/auth/register
  router.post("/register", authController.register);

  // Auth: Login / Sign in (POST): /api/auth/login
  router.post("/login", authController.login);

  return router;
};
