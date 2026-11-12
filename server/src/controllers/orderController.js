// Get Firestore database connection
const { db } = require("../config/db");

// Import Joi order validation schema
const orderSchema = require("../schemas/orderSchema");

// Import custom error handler
const ApiError = require("../utilities/ApiError");

module.exports = {
  // --------------------------------------
  // Place an order using Cash on Delivery
  // POST /api/order/place
  // --------------------------------------

  async placeOrder(req, res, next) {
    try {
      // Get the authenticated user ID from userAuth middleware
      const userId = req.userId;

      // Get order information from request body
      const { items, amount, address } = req.body;

      // Prepare order information
      const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: "COD",
        payment: false,
        status: "Order Placed",
        date: Date.now(),
      };

      // Validate order information using Joi
      const { error, value } = orderSchema.validate(orderData, {
        abortEarly: false,
      });

      if (error) {
        return next(
          ApiError.badRequest(
            error.details.map((detail) => detail.message).join(","),
          ),
        );
      }

      // Get references to the orders and users collections
      const orderRef = db.collection("orders").doc();
      const userRef = db.collection("users").doc(userId);

      // Atomically create the order and clear the user's cart
      const batch = db.batch();

      batch.set(orderRef, value);
      batch.update(userRef, { cartData: {} });

      await batch.commit();

      // Return success response
      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        orderId: orderRef.id,
      });
    } catch (err) {
      return next(ApiError.internal("Failed to place order", err));
    }
  },

  // --------------------------------------
  // Place an order using Stripe
  // POST /api/order/stripe
  // --------------------------------------
  async placeOrderStripe(req, res, next) {
    try {
    } catch (err) {
      return next(ApiError.internal("Failed to process Stripe order", err));
    }
  },

  // Placing orders using Razorpay method
  async placeOrderRazorpay(req, res, next) {},

  // --------------------------------------
  // Display orders for admin panel
  // POST /api/order/list
  // --------------------------------------

  async allOrders(req, res, next) {
    try {
      // Retrieve all orders from Firestore
      const snapshot = await db.collection("orders").get();

      // Convert Firestore documents into an array
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Return all orders to the admin panel
      return res.status(200).json({ success: true, orders });
    } catch (err) {
      console.error("Get All Orders Error:", err);

      return next(ApiError.internal("Failed to retrieve all orders"));
    }
  },

  // --------------------------------------
  // Get orders for the authenticated user
  // POST /api/order/userorders
  // --------------------------------------

  async userOrders(req, res, next) {
    try {
      // Get the authenticated user ID from userAuth middleware
      const userId = req.userId;

      // Retrieve orders belonging to the authenticated user
      const snapshot = await db
        .collection("orders")
        .where("userId", "==", userId)
        .get();

      // Convert Firestore documents into an array
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Return the user's orders
      return res.status(200).json({ success: true, orders });
    } catch (err) {
      return next(ApiError.internal("Failed to retrieve user orders", err));
    }
  },

  // --------------------------------------
  // Update order status - Admin Only
  // POST /api/order/status
  // --------------------------------------

  async updateStatus(req, res, next) {
    try {
      // Get order ID and new status from request body
      const { orderId, status } = req.body;

      // Validate required fields
      if (!orderId || !status) {
        return next(ApiError.badRequest("Order ID and status are required"));
      }

      // Get the order document reference
      const orderRef = db.collection("orders").doc(orderId);

      // Check if the order exists
      const orderSnapshot = await orderRef.get();

      if (!orderSnapshot.exists) {
        return next(ApiError.notFound("Order not found"));
      }

      // Update the order status in Firestore
      await orderRef.update({ status });

      // Return success response
      return res.status(200).json({
        success: "true",
        message: " Order status updated successfully",
      });
    } catch (err) {
      console.error("Update Order Status Error:", err);

      return next(ApiError.internal("Failed to update order status"));
    }
  },
};
