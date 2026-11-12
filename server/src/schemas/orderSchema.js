const Joi = require("joi");

// Validate order information before saving to Firestore
const orderSchema = Joi.object({
  // Authenticated user ID
  userId: Joi.string().required(),

  // Order must contain at least one item
  items: Joi.array().min(1).required(),

  // Total order amount
  amount: Joi.number().positive().required(),

  // Delivery address
  address: Joi.object().min(1).required(),

  // Default order status
  status: Joi.string()
    .valid(
      "Order Placed",
      "Packing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    )
    .default("Order Placed"),

  // Supported payment method: stripe, razorpay
  paymentMethod: Joi.string().valid("COD", "Stripe", "Razorpay").required(),

  // Default payment status
  payment: Joi.boolean().default(false),

  // Order creation date
  date: Joi.number().integer().positive().required(),
});

module.exports = orderSchema;
