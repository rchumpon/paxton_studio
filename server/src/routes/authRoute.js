const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");

module.exports = () => {
  // Auth Test Route: Lists all users (GET): /api/auth/users
  router.get("/users", AuthController.listUsers);

  // Auth: Register / Sign up (POST): /api/auth/register
  router.post("/register", AuthController.register);

  // Auth: Login / Sign in (POST): /api/auth/login
  router.post("/login", AuthController.login);

  return router;
};
