const Joi = require("joi");

// Define user validation schema
const userSchema = Joi.object({
  // User's name is required
  username: Joi.string().min(2).required(),

  // Email must be valid
  email: Joi.string().email().required(),

  // Password must contain at least 8 characters
  password: Joi.string().min(8).required(),

  // Store user's shopping cart data
  cartData: Joi.object().default({}),
});

module.exports = userSchema;
