const { Given } = require('@cucumber/cucumber');
const axios = require('axios');

const API_URL = 'http://localhost:8080/api/products';

Given('the following products', async function (dataTable) {
    // 1. Clear existing products first to ensure a clean state
    try {
      const response = await axios.get(API_URL);
      const existingProducts = response.data;
      for (const product of existingProducts) {
        if (product.id) { // Ensure product has an ID
          await axios.delete(`${API_URL}/${product.id}`);
        }
      }
    } catch (error) {
      // Ignore if no products or API error, as the goal is to clear if possible
      console.warn('Could not clear existing products, proceeding with creation:', error.message);
    }
  
    // 2. Create the new products from the dataTable
    const products = dataTable.hashes();
    for (const product of products) {
      const payload = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        available: product.available.toLowerCase() === 'true',
        category: product.category.toUpperCase(), // Assuming API expects uppercase category
      };
      
      try {
        await axios.post(API_URL, payload);
      } catch (error) {
        console.error(`Failed to create product ${product.name}:`, error.response ? error.response.data : error.message);
        throw new Error(`Failed to create product ${product.name} via API`);
      }
    }
  });