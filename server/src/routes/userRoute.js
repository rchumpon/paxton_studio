import express from "express";
const router = express.Router();

const userController = require("../controllers/userController");

module.exports = () => {
  router.post("/admin", userController.adminLogin);

  return router;
};
