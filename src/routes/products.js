const express = require('express');
const { Product, Category, sequelize } = require('../models/product');
const { Op } = require('sequelize');
const { validateProduct, checkContentType } = require('../middleware/validation');

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 200, message: 'OK' });
});

/**
 * CREATE A NEW PRODUCT
 */
router.post('/', checkContentType('application/json'), validateProduct, async (req, res) => {
  try {

    
    const product = await Product.create(req.body);

    
    const location = `/api/products/${product.id}`;
    res.status(201)
       .location(location)
       .json(product.serialize());
       
  } catch (error) {

    res.status(400).json({ 
      error: 'Bad Request', 
      message: error.message 
    });
  }
});


module.exports = router;