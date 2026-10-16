const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const { userAuth } = require("../middleware/userAuth");
module.exports = () => {
  router.post("/get", userAuth, cartController.getUserCart);
  router.post("/add", userAuth, cartController.addToCart);
  router.post("/update", userAuth, cartController.updateCart);
  return router;
};
