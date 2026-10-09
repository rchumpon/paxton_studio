const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/productController");
const upload = require("../middleware/multer");

module.exports = () => {
  router.post(
    "/add",
    // Handle up to 4 product images
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
    ]),

    // Call the controller after Multer processes the images
    ProductController.addProduct,
  );

  router.post("/remove", ProductController.removeProduct);

  router.get("/:productId", ProductController.singleProduct);

  router.get("/list", ProductController.listProducts);

  return router;
};
