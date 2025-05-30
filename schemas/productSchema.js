// schemas/productSchema.js
const Joi = require('joi');
const { ValidationError } = require('../errors/databaseErrors');

// Base product schema
const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name should have at least {#limit} characters',
      'string.max': 'Name cannot exceed {#limit} characters',
      'any.required': 'Name is required'
    }),
  
  brand: Joi.string().min(2).max(50).required()
    .messages({
      'any.required': 'Brand is required'
    }),
  
  price: Joi.number().positive().precision(2).required()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be greater than zero',
      'any.required': 'Price is required'
    }),
  
  stock: Joi.number().integer().min(0).required()
    .messages({
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative',
      'any.required': 'Stock is required'
    }),
  
  category: Joi.string().valid(
    'Electronics', 
    'Clothing', 
    'Home & Kitchen',
    'Sports & Outdoors',
    'Beauty',
    'Toys',
    'Books',
    'Automotive'
  ).required()
    .messages({
      'any.only': 'Invalid category. Valid options: Electronics, Clothing, Home & Kitchen, Sports & Outdoors, Beauty, Toys, Books, Automotive',
      'any.required': 'Category is required'
    }),
  
  isAvailable: Joi.boolean().default(true),
  
  specifications: Joi.string().min(2).max(100).required()
});

// Validate product creation
function validateProduct(productData) {
  const { error, value } = productSchema.validate(productData, {
    abortEarly: false, // Collect all errors
    allowUnknown: false // Reject unknown fields
  });
  
  if (error) {
    throw new ValidationError(error.details);
  }
  
  return value;
}

// Validate product update (all fields optional)
function validateProductUpdate(productData) {
  const updateSchema = productSchema.fork(
    Object.keys(productSchema.describe().keys),
    (schema) => schema.optional()
  );
  
  const { error, value } = updateSchema.validate(productData, {
    abortEarly: false,
    allowUnknown: false
  });
  
  if (error) {
    throw new ValidationError(error.details);
  }
  
  return value;
}

module.exports = {
  validateProduct,
  validateProductUpdate
};