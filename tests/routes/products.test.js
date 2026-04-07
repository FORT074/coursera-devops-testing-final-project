const request = require('supertest');
const app = require('../../src/app');
const { Product } = require('../../src/models/product');
const { ProductFactory } = require('../factories');
const BASE_URL = '/api/products';

describe('Product Routes', () => {

  
  /**
   * Utility function to bulk create products
   */
  async function createProducts(count = 1) {
    const products = [];
    for (let i = 0; i < count; i++) {
      const productData = ProductFactory.build();
      const product = await Product.create(productData);
      products.push(product);
    }
    return products;
  }
  
  /**
   * Utility function to get product count
   */
  async function getProductCount() {
    const response = await request(app)
      .get(BASE_URL)
      .expect(200);
    return response.body.length;
  }
  
  describe('Basic Endpoints', () => {
    test('should return the index page', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toContain('Product Catalog Administration');
    });
    
    test('should be healthy', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/health`)
        .expect(200);
      
      expect(response.body.message).toBe('OK');
    });
  });

  
  
  describe('CREATE Product', () => {
    test('should create a new product', async () => {
      const testProduct = ProductFactory.build();

      
      const response = await request(app)
        .post(BASE_URL)
        .send(testProduct)
        .expect(201);
      
      // Make sure location header is set
      expect(response.headers.location).toBeDefined();
      
      // Check the data is correct
      const newProduct = response.body;
      expect(newProduct.name).toBe(testProduct.name);
      expect(newProduct.description).toBe(testProduct.description);
      expect(newProduct.price).toBe(testProduct.price);
      expect(newProduct.available).toBe(testProduct.available);
      expect(newProduct.category).toBe(testProduct.category);
      
      
      
      
    });
    
    test('should not create a product without a name', async () => {
      const productData = ProductFactory.build();
      delete productData.name;
      

      
      const response = await request(app)
        .post(BASE_URL)
        .send(productData)
        .expect(400);
      
      expect(response.body.error).toBe('Validation Error');
    });
    
    test('should not create a product with no Content-Type', async () => {
      await request(app)
        .post(BASE_URL)
        .send('bad data')
        .expect(415);
    });
    
    test('should not create a product with wrong Content-Type', async () => {
      await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'text/plain')
        .send('some plain text data')
        .expect(415);
    });

    test('should proceed if content type is correct but has extra parameters', async () => {
      const productData = ProductFactory.build();
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json; charset=utf-8')
        .send(productData);

      // We expect a 201, not a 415, because the base type is correct.
      expect(response.status).toBe(201);
    });
  });


  test('should get a single product', async () => {
    const products = await createProducts(1);
    const testProduct = products[0];
   
    const response = await request(app)
      .get(`${BASE_URL}/${testProduct.id}`)
      .expect(200);
   
    expect(response.body.name).toBe(testProduct.name);
  });

  test('should not get a product that is not found', async () => {
    await request(app)
      .get(`${BASE_URL}/99999`)
      .expect(404);
  });

  describe('UPDATE Product', () => {
    test('should update a product', async () => {
      // 1. Create a product first
      const products = await createProducts(1);
      const product = products[0];
      
      // 2. Data to update
      const updateData = ProductFactory.build();
      delete updateData.id;
      
      // 3. Make the PUT request
      const response = await request(app)
        .put(`${BASE_URL}/${product.id}`)
        .set('Content-Type', 'application/json')
        .send(updateData)
        .expect(200);
        
      // 4. Verify it was updated
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
    });
    
    test('should return 404 for updating non-existent product', async () => {
      const updateData = ProductFactory.build();
      await request(app)
        .put(`${BASE_URL}/9999`)
        .set('Content-Type', 'application/json')
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE Product', () => {
    test('should delete a product', async () => {
      // 1. Create a product
      const products = await createProducts(1);
      const product = products[0];
      
      // 2. Delete it
      await request(app)
        .delete(`${BASE_URL}/${product.id}`)
        .expect(204); // Expect No Content
        
      // 3. Try to get it again, should be 404
      await request(app)
        .get(`${BASE_URL}/${product.id}`)
        .expect(404);
    });
    
    test('should return 404 for deleting non-existent product', async () => {
      await request(app)
        .delete(`${BASE_URL}/9999`)
        .expect(404);
    });
  });

  describe('LIST & QUERY Products', () => {
    beforeEach(async () => {
      // Clear the database before each query test to ensure exact counts
      await Product.destroy({ where: {} });
    });

    test('should list all products', async () => {
      await createProducts(5);
      
      const response = await request(app)
        .get(BASE_URL)
        .expect(200);
        
      expect(response.body.length).toBe(5);
    });

    test('should list products by name', async () => {
      await Product.create(ProductFactory.build({ name: 'UniqueHat' }));
      await Product.create(ProductFactory.build({ name: 'UniqueHat' }));
      await Product.create(ProductFactory.build({ name: 'BoringShirt' }));
      
      const response = await request(app)
        .get(`${BASE_URL}?name=UniqueHat`)
        .expect(200);
        
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('UniqueHat');
      expect(response.body[1].name).toBe('UniqueHat');
    });

    test('should list products by category', async () => {
      await Product.create(ProductFactory.build({ category: 'FOOD' }));
      await Product.create(ProductFactory.build({ category: 'TOOLS' }));
      await Product.create(ProductFactory.build({ category: 'FOOD' }));
      
      const response = await request(app)
        .get(`${BASE_URL}?category=FOOD`)
        .expect(200);
        
      expect(response.body.length).toBe(2);
      expect(response.body[0].category).toBe('FOOD');
    });

    test('should list products by availability', async () => {
      await Product.create(ProductFactory.build({ available: true }));
      await Product.create(ProductFactory.build({ available: false }));
      await Product.create(ProductFactory.build({ available: true }));
      await Product.create(ProductFactory.build({ available: true }));
      
      const response = await request(app)
        .get(`${BASE_URL}?available=true`)
        .expect(200);
        
      expect(response.body.length).toBe(3);
      expect(response.body[0].available).toBe(true);
    });
  });

  
});