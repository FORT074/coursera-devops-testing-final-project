const { Given } = require('@cucumber/cucumber');
const axios = require('axios');

const API_URL = 'http://localhost:8080/api/products';

Given('the following products', async function (dataTable) {
  // Clear existing products first to ensure a clean state
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

  
});