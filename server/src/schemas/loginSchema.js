const Joi = require("joi");

// Validate user login details
const loginSchema = Joi.object({
  // Email must be valid and required
  email: Joi.string().email().required(),

  // Password is required
  password: Joi.string().required(),
});

// Export using CommonJS
module.exports = loginSchema;
