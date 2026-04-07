const Joi = require('joi');
const { Category } = require('../models/product');

/**
 * Product validation schema
 */
const productSchema = Joi.object({
  name: Joi.string().min(1).max(100).required()
    .messages({
      'string.empty': 'Product name is required',
      'string.max': 'Product name must be less than 100 characters'
    }),
  
  description: Joi.string().min(1).max(250).required()
    .messages({
      'string.empty': 'Product description is required',
      'string.max': 'Product description must be less than 250 characters'
    }),
  
  price: Joi.number().positive().precision(2).required()
    .messages({
      'number.positive': 'Product price must be a positive number',
      'any.required': 'Product price is required'
    }),
  
  available: Joi.boolean().required()
    .messages({
      'any.required': 'Product availability is required'
    }),
  
  category: Joi.string().valid(...Object.values(Category)).required()
    .messages({
      'any.only': `Category must be one of: ${Object.values(Category).join(', ')}`,
      'any.required': 'Product category is required'
    })
});

/**
 * Middleware to validate product data
 */
function validateProduct(req, res, next) {
  const { error, value } = productSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: errorMessages.join('; ')
    });
  }
  
  req.body = value;
  next();
}

/**
 * Middleware to check content type
 */
function checkContentType(expectedType = 'application/json') {
  return (req, res, next) => {
    if (!req.headers['content-type']) {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: `Content-Type must be ${expectedType}`
      });
    }
    
    if (!req.headers['content-type'].includes(expectedType)) {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: `Content-Type must be ${expectedType}`
      });
    }
    
    next();
  };
}

module.exports = {
  validateProduct,
  checkContentType,
  productSchema
};