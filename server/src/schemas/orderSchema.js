// Import Joi validation library
const Joi = require("joi");

// Validate order information before saving to Firestore
const orderSchema = Joi.object({
  // Authenticated user ID
  userId: Joi.string().required(),

  // Order must contain at least one item
  items: Joi.array().min(1).required(),

  // Total order amount including delivery charges
  amount: Joi.number().positive().required(),

  // Delivery address at least one product
  address: Joi.object().min(1).required(),

  // Order status throughout the payment and delivery process
  status: Joi.string()
    .valid(
      "Pending Payment",
      "Order Placed",
      "Packing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    )
    .default("Order Placed"),

  // Supported payment method: stripe, razorpay
  paymentMethod: Joi.string().valid("COD", "Stripe", "Razorpay").required(),

  // Payment status: false = unpaid, true = paid
  payment: Joi.boolean().default(false),

  // Order creation timestamp in milliseconds
  date: Joi.number().integer().positive().required(),
});

module.exports = orderSchema;
