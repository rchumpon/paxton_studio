//=============================================
// Cart Controller
// Handles cart requests and responses
//=============================================

// Get Firestore database connection
const { db } = require("../config/db");

// Import custom error handler
const ApiError = require("../utilities/ApiError");

module.exports = {
  // Add products to user cart
  async addToCart(req, res, next) {
    try {
      // Get the authenticated user ID from authUser middleware
      const userId = req.userId;

      // Get product ID and selected size from request body
      const { itemId, size } = req.body;

      // Validate incoming cart details
      if (
        typeof itemId !== "string" ||
        !itemId.trim() ||
        typeof size !== "string" ||
        !size.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Product Id and size are required",
        });
      }
      // Reference the user's document in Firestore
      const userRef = db.collection("users").doc(userId);

      // Update the cart safely using a Firestore transaction
      await db.runTransaction(async (transaction) => {
        // Retrieve the user's document
        const userDoc = await transaction.get(userRef);

        // Check whether the user exists
        if (!userDoc.exists) {
          throw new Error("User not found");
        }

        // Get the user's existing cart or create an empty cart
        const cartData = userDoc.data().cartData || {};

        // Check whether the product already exists in the cart
        if (cartData[itemId]) {
          // Check whether the selected size already exists
          if (cartData[itemId][size]) {
            // Increase the quantity by 1
            cartData[itemId][size] += 1;
          } else {
            // Add the selected size with quantity 1
            cartData[itemId][size] = 1;
          }
        } else {
          // Add a new product with the selected size
          cartData[item] = {
            [size]: 1,
          };
        }

        // Save the updated cart to Firestore
        transaction.update(userRef, { cartData });
      });

      // Return successful response
      return res.status(200).json({ success: true, message: "Added To Cart" });
    } catch (err) {
      console.error("Add To Cart Error", err);

      // Pass the error to the Express error-handling middleware
      return next(
        ApiError.internal("Product could not be added at this time...", err),
      );
    }
  },

  // Update user cart
  async updateCart(req, res, next) {
    try {
      // Get the authenticated user's ID from JWT middleware
      const userId = req.userId;

      // Get the product ID, selected size and quantity from the frontend
      const { itemId, size, quantity } = req.body;

      // Validate incoming cart details
      if (
        typeof itemId !== "string" ||
        !itemId.trim() ||
        typeof size !== "string" ||
        !size.trim() ||
        typeof quantity !== "number" ||
        !Number.isInteger(quantity) ||
        quantity < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid product Id, size, and quantity are required",
        });
      }

      // Reference the user's document in Firestore
      const userRef = db.collection("users").doc(userId);

      // Update the cart using a Firestore transaction
      await db.runTransaction(async (transaction) => {
        // Retrieve the user's document
        const userDoc = await transaction.get(userRef);

        // Check whether the user exists
        if (!userDoc.exists) {
          throw new Error("User not found");
        }

        // Get the existing cart or create an empty cart
        const cartData = userDoc.data().cartData || {};

        // Check whether the product exists in the cart
        if (cartData[itemId]) {
          if (quantity === 0) {
            // Remove the selected size from the cart
            delete cartData[itemId][size];

            // Remove the product if no sizes remain
            if (Object.keys(cartData[itemId]).length === 0) {
              delete cartData[itemId];
            }
          } else {
            // Update the selected size quantity
            cartData[itemId][size] = quantity;
          }
        } else if (quantity > 0) {
          // Add the product if it does not exist
          cartData[itemId] = {
            [size]: quantity,
          };
        }

        // Save the updated cart to Firestore
        transaction.update(userRef, { cartData });
      });

      // Return a successful response
      return res
        .status(200)
        .json({ success: true, message: " Cart updated successfully" });
    } catch (err) {
      return next(
        ApiError.internal("Cart could not be updated at this time...", err),
      );
    }
  },

  // Get user cart data
  async getUserCart(req, res) {
    try {
      // Get the authenticated user's ID from JWT middleware
      const userId = req.userId;

      // Reference the user's document in Firestore
      const userRef = db.collection("user").doc(userId);
      // Retrieve the user's document
      const userDoc = await userRef.get();

      // Check whether the user exists
      if (!userDoc.exists) {
        return next(ApiError.badRequest("User not found"));
      }

      // Get the user's cart data
      const cartData = userDoc.data().cartData || {};

      //return the user's cart data to the frontend
      return res.status(200).json({ success: true, cartData });
    } catch (err) {
      return next(
        ApiError.internal(
          "Cart data could not be retrieved at this time...",
          err,
        ),
      );
    }
  },
};
