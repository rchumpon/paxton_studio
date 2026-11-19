// Get Firestore database connection
const { db } = require("../config/db");

// Import Joi order validation schema
const orderSchema = require("../schemas/orderSchema");

// Import Stripe SDK
const Stripe = require("stripe");

// Import custom error handler
const ApiError = require("../utilities/ApiError");

// --------------------------------------
// Stripe payment configuration
// --------------------------------------

// Currency used for Stripe payments (Globle variables)
const currency = "aud";

// Fixed delivery charge in AUD
const deliveryCharge = 10;

// Initialize Stripe using the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

      // Get references to the new order and the user's document
      const orderRef = db.collection("orders").doc();
      const userRef = db.collection("users").doc(userId);

      // Atomically create the order and clear the user's cart
      const batch = db.batch();

      // Save the order in Firestore
      batch.set(orderRef, value);

      // Clear the user's shopping cart
      batch.update(userRef, { cartData: {} });

      // Commit both operations to Firestore
      await batch.commit();

      // Return successful order response
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
      // Get the authenticated user ID from userAuth middleware
      const userId = req.userId;

      // Get order information from request body
      const { items, amount, address } = req.body;

      // Use a trusted frontend URL from environment variables
      const frontendUrl = process.env.FRONTEND_URL;

      // Prepare order information with pending payment status
      const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: "Stripe",
        payment: false,
        status: "Pending Payment",
        date: Date.now(),
      };

      // Validate order information using Joi
      const { error, value } = orderSchema.validate(orderData, {
        abortEarly: false,
      });

      // Return validation errors if the order data is invalid
      if (error) {
        return next(
          ApiError.badRequest(
            error.details.map((detail) => detail.message).join(","),
          ),
        );
      }
      // Generate a unique Firestore document reference for the order
      const orderRef = db.collection("orders").doc();

      console.log("Stripe Order Items:", items);

      // Convert each product into a Stripe Checkout line item
      const line_items = items.map((item) => ({
        price_data: {
          currency: currency,
          // Product information displayed on Stripe Checkout
          product_data: {
            name: item.name,

            // Display the selected product size and quantity
            description: `Size: ${item.size} | Quantity: ${item.quantity}`,

            // Display the product image
            images: item.image?.length ? [item.image[0]] : [],
          },
          // Convert AUD dollars into cents for Stripe
          unit_amount: Math.round(Number(item.price) * 100),
        },
        // Number of units purchased
        quantity: item.quantity,
      }));

      // Add the fixed delivery charge as a separate line item
      line_items.push({
        price_data: {
          currency: currency,
          product_data: {
            name: "Delivery Charge",
          },
          // Convert the delivery charge from dollars to cents
          unit_amount: Math.round(Number(deliveryCharge) * 100),
        },
        // Delivery is charged once per order
        quantity: 1,
      });

      // Create a Stripe-hosted Checkout Session
      const session = await stripe.checkout.sessions.create({
        // Allow customers to pay using a credit or debit card
        payment_method_types: ["card"],

        // Accept a one-time payment
        mode: "payment",

        // Products and delivery charge displayed at checkout
        line_items,

        // Redirect to verification page after successful checkout
        success_url: `${frontendUrl}/verify?success=true&orderId=${orderRef.id}&session_id={CHECKOUT_SESSION_ID}`,

        // Redirect to verification page if checkout is cancelled
        cancel_url: `${frontendUrl}/verify?success=false&orderId=${orderRef.id}`,

        // Attach identifiers to associate Stripe payment with Firestore
        metadata: {
          orderId: orderRef.id,
          userId,
        },
      });

      // Save the pending order and Stripe Session ID in Firestore
      await orderRef.set({
        ...value,
        stripeSessionId: session.id,
      });

      // Return the Stripe checkout URL to the frontend
      return res.status(201).json({
        success: true,
        message: "Stripe Checkout Session created successfully",
        sessionUrl: session.url,
        orderId: orderRef.id,
      });
    } catch (err) {
      // Pass the error to the global error handler
      return next(ApiError.internal("Failed to process Stripe order", err));
    }
  },

  // --------------------------------------
  // Verify Stripe
  // POST /api/order/verifyStrip
  // --------------------------------------

  async verifyStripe(req, res, next) {
    try {
      // Get the order ID and Stripe Checkout Session ID
      const { orderId, sessionId } = req.body;

      // Get the authenticated user ID from userAuth middleware
      const userId = req.userId;

      // Validate required information
      if (!orderId || !sessionId) {
        return next(
          ApiError.badRequest("Order ID and session ID are required"),
        );
      }

      // Get references to the order and user documents
      const orderRef = db.collection("orders").doc(orderId);
      const userRef = db.collection("users").doc(userId);

      // Retrieve the order from Firestore
      const orderDoc = await orderRef.get();

      // Check whether the order exists
      if (!orderDoc.exists) {
        return next(ApiError.badRequest("Order not found"));
      }

      // Get the stored order information
      const orderData = orderDoc.data();

      // Verify that the order belongs to the authenticated user
      if (orderData.userId !== userId) {
        return next(ApiError.badRequest("Invalid order"));
      }

      // Confirm that the order was created using Stripe
      if (orderData.paymentMethod !== "Stripe") {
        return next(ApiError.badRequest("Invalid payment method"));
      }

      // Verify that the session ID belongs to this order
      if (orderData.stripeSessionId !== sessionId) {
        return next(ApiError.badRequest("Invalid Stripe session"));
      }

      // Retrieve the checkout session directly from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Confirm that Stripe's metadata matches the order and user
      if (
        session.metadata?.orderId !== orderId ||
        session.metadata?.userId !== userId
      ) {
        return next(ApiError.badRequest("Stripe session mismatch"));
      }

      // Verify that Stripe has confirmed the payment
      if (session.payment_status !== "paid") {
        return res.status(200).json({
          success: false,
          message: "Payment has not been completed",
        });
      }

      // Check that the payment currency and amount match the order
      const expectedAmount = Math.round(Number(orderData.amount) * 100);

      if (
        session.currency !== currency ||
        session.amount_total !== expectedAmount
      ) {
        return next(ApiError.badRequest("Payment amount mismatch"));
      }

      // Avoid processing an order that is already marked as paid
      if (orderData.payment === true) {
        return res.status(200).json({
          success: true,
          message: "Payment already verified",
        });
      }

      // Atomically update the payment status and clear the user's cart
      const batch = db.batch();

      // Mark the order as paid
      batch.update(orderRef, {
        payment: true,
        status: "Order Placed",
      });

      // Clear the user's shopping cart
      batch.update(userRef, {
        cartData: {},
      });

      // Save both changes to Firestore
      await batch.commit();

      // Return successful payment verification response
      return res.status(200).json({
        success: true,
        message: "Stripe payment verified successfully",
      });
    } catch (error) {
      console.error("Verify Stripe Error:", err);

      return next(ApiError.internal("Failed to verify Stripe payment", err));
    }
  },

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
