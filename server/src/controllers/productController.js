//=============================================
// Product Controller
// Handles product requests and responses
//=============================================

// Get Firestore database connection
const { db } = require("../config/db");

// Import Cloudinary SDK
const { v2: cloudinary } = require("cloudinary");

// Import Joi product validation schema
const productSchema = require("../schemas/productSchema");

// Import custom error handler
const ApiError = require("../utilities/ApiError");

// ========================================================
// Helper function to upload an image buffer to Cloudinary
// ========================================================

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    // Ensure Multer provided the image buffer
    if (!file || !Buffer.isBuffer(file.buffer)) {
      return reject(newError("Image buffer is missing"));
    }

    // Create a Cloudinary upload stream
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        asset_folder: "paxton-studio/products",
      },
      (error, result) => {
        // Reject if Cloudinary returns an error
        if (error) {
          return reject(error);
        }

        // Ensure Cloudinary returned a valid image URL
        if (!result?.secure_url) {
          return reject(new Error("Cloudinary did not return an image URL"));
        }
        // Return the upload stream errors
        resolve(result.secure_url);
      },
    );
    // Handle upload stream errors
    stream.on("error", reject);

    // Send the image buffer to Cloudinary
    stream.end(file.buffer);
  });
};

// ==========================================
// Product controller
// ==========================================

module.exports = {
  // ----------------------------------
  // Add a new product
  // POST /api/product/add
  // ----------------------------------

  async addProduct(req, res, next) {
    try {
      // Get the uploaded images from Multer
      // Filter out any image fields that were not provided
      const images = [
        req.files?.image1?.[0],
        req.files?.image2?.[0],
        req.files?.image3?.[0],
        req.files?.image4?.[0],
      ].filter(Boolean);

      // Require at least one product image
      if (images.length === 0) {
        return next(ApiError.badRequest("At least one image is required"));
      }

      // Check that every uploaded image has a valid buffer
      if (images.some((file) => !Buffer.isBuffer(file.buffer))) {
        return next(ApiError.badRequest("One or more image files are invalid"));
      }

      // Convert sizes from JSON string into JavaScript array
      let sizes;

      try {
        sizes = JSON.parse(req.body.sizes);
      } catch {
        return next(ApiError.badRequest("Sizes must be a valid JSON array"));
      }

      // Ensure sizes is an array
      if (!Array.isArray(sizes)) {
        return next(ApiError.badRequest("Sizes must be an array"));
      }

      // Validate price before converting it too a number
      const price = Number(req.body.price);

      if (
        req.body.price === undefined ||
        req.body.price === "" ||
        !Number.isFinite(price)
      ) {
        return next(ApiError.badRequest("Price must be a valid number"));
      }

      // Validate bestseller if provided
      if (
        req.body.bestseller !== undefined &&
        req.body.bestseller !== "true" &&
        req.body.bestseller !== "false"
      ) {
        return next(ApiError.badRequest("Bestseller must be true or false"));
      }

      // Convert form-data fields into the expected data types
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price,
        category: req.body.category,
        subCategory: req.body.subCategory,
        sizes,

        // Convert string "true" into boolean true
        bestseller: req.body.bestseller === "true",

        // Store the creation timestamp
        date: Date.now(),
      };

      // Validate product details before uploading images
      // Image URLs will be added after Cloudinary upload
      const { error, value } = productSchema
        .fork(["image"], (schema) => schema.optional())
        .validate(productData, {
          abortEarly: false,
        });

      // Return validation errors
      if (error) {
        return next(
          ApiError.badRequest(
            error.details.map((item) => item.message).join(","),
          ),
        );
      }

      // Upload all product images to Cloudinary
      const imageUrls = await Promise.all(
        images.map((file) => uploadToCloudinary(file)),
      );

      console.log("Cloudinary upload successful:", imageUrls);

      // Combine validated product details with image URLs
      const completeProduct = {
        ...value,
        image: imageUrls,
      };

      // Validate the complete product
      const finalValidation = productSchema.validate(completeProduct, {
        abortEarly: false,
      });

      if (finalValidation.error) {
        return next(
          ApiError.badRequest(
            finalValidation.error.details.map((item) => item.message).join(","),
          ),
        );
      }

      // Get FireStore products collection
      const productRef = db.collection("products");

      // Save the product to Firestore
      const response = await productRef.add(finalValidation.value);

      // Display the new product ID
      console.log(`Product: ${response.id} added successfully!`);

      // Send successful response
      return res.status(201).json({
        success: true,
        message: "Product added successfully",
        productId: response.id,
      });
    } catch (err) {
      // Display the unexpected error in the backend terminal
      console.error("Add Product Error:", err);

      // Pass unexpected errors to custom error handler
      return next(
        ApiError.internal("Product could not be added at this time...", err),
      );
    }
  },

  // ----------------------------------
  // Get all product
  // GET /api/product/list
  // ----------------------------------

  async listProducts(req, res, next) {
    try {
      // Get the products collection from Firestore
      const productRef = db.collection("products");

      // Retrieve all product documents
      const snapshot = await productRef.get();

      // Convert Firestore documents into JavaScript objects
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,

        // Include all product fields
        ...doc.data(),
      }));

      // Return the products to the client
      return res.status(200).json({ success: true, products });
    } catch (err) {
      console.error("List Product Error:", err);

      // Pass the error to your custom error handler
      return next(
        ApiError.internal("Product could not be listed at this time...", err),
      );
    }
  },

  // ----------------------------------
  // Get a single product by ID
  // GET /api/product/:productId
  // ----------------------------------

  async singleProduct(req, res, next) {
    try {
      // Get the product ID from the URL
      const { productId } = req.params;

      // Check if the product ID is provided
      if (!productId || typeof productId !== "string") {
        return next(ApiError.badRequest("Product ID is required"));
      }

      // Get a reference to the specific product document
      const productRef = db.collection("products").doc(productId);

      // Retrieve the product from Firestore
      const snapshot = await productRef.get();

      // Check if the product exists
      if (!snapshot.exists) {
        return next(ApiError.notFound("Product not found"));
      }

      // Convert Firestore document into a JavaScript object
      const product = {
        ...snapshot.data(),
        id: snapshot.id,
      };

      // Return the product to the client
      return res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      console.error("Single Product Error:", err);
      return next(
        ApiError.internal("Product could not be found at this time...", err),
      );
    }
  },

  // ----------------------------------
  // Remove a product
  // POST /api/product/remove
  // ----------------------------------

  async removeProduct(req, res, next) {
    try {
      // Get the product ID from the request body
      const { productId } = req.body;

      // Check if product ID is provided
      if (!productId || typeof productId !== "string") {
        return next(ApiError.badRequest("Product ID is required"));
      }

      // Get a reference to the product document
      const productRef = db.collection("products").doc(productId);

      // Check if the product exists
      const snapshot = await productRef.get();

      if (!snapshot.exists) {
        return next(ApiError.notFound("Product not found"));
      }

      // Delete the product from Firestore
      await productRef.delete();

      // Return success response
      return res.status(200).json({
        success: true,
        message: "Product removed successfully",
        productId,
      });
    } catch (err) {
      // Log the error
      console.error("Remove Product Error:", err);

      return next(
        ApiError.internal("Product could not be removed at this time...", err),
      );
    }
  },
};
