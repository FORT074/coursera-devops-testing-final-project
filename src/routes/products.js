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


// READ A PRODUCT 
router.get('/:id', async (req, res) => {
  try {
	console.log('Request to Retrieve a product with id [%s]', req.params.id);
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.status(200).json(product.serialize());
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { name, category, available } = req.query;
    let whereClause = {};
    
    // Add query parameters to where clause if they exist
    if (name) whereClause.name = name;
    if (category) whereClause.category = category;
    if (available !== undefined) whereClause.available = available === 'true';

    const products = await Product.findAll({ where: whereClause });
    res.status(200).json(products.map(p => p.serialize ? p.serialize() : p));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// UPDATE A PRODUCT
router.put('/:id', checkContentType('application/json'), validateProduct, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Not Found' });
    }
    
    await product.update(req.body);
    res.status(200).json(product.serialize ? product.serialize() : product);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request', message: error.message });
  }
});

// DELETE A PRODUCT
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Not Found' });
    }
    
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;