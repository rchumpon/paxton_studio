const express = require("express");
const productController = require("../controllers/productController");
const upload = require("../middleware/multer");
const { adminAuth } = require("../middleware/adminAuth");

module.exports = () => {
  const router = express.Router();

  // Public: get all products
  router.get("/list", productController.listProducts);

  // Public: get a single product
  router.get("/:productId", productController.singleProduct);

  // Admin only: add a product
  router.post(
    "/add",
    adminAuth,
    // Handle up to 4 product images
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
    ]),

    // Call the controller after Multer processes the images
    productController.addProduct,
  );

  // Admin only: remove a product by its Firestore document ID
  router.delete("/:productId", adminAuth, productController.removeProduct);

  return router;
};
