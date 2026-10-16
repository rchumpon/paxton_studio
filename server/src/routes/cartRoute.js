const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartControllers");
module.exports = () => {
  router.post("/get", cartController.getUserCart);
  router.post("/add", cartController.addToCart);
  router.post("/update", cartController.updateCart);
  return router;
};
