const Joi = require("joi");

// Define product validation schema
const productSchema = Joi.object({
  // Product name is required
  name: Joi.string().required(),

  // Product description is required
  description: Joi.string().required(),

  // Product price must be greater than 0
  price: Joi.number().positive().required(),

  // Product must have at least one image URL
  image: Joi.array().items(Joi.string().uri()).min(1).required(),

  // Product category
  category: Joi.string().required(),

  // Product subcategory
  subCategory: Joi.string().required(),

  // Available sizes
  sizes: Joi.array().items(Joi.string()).min(1).required(),

  // Bestseller status
  bestseller: Joi.boolean().default(false),

  // Product creation date
  date: Joi.number().required(),
});

module.exports = productSchema;
