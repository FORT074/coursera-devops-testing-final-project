const { initializeDatabase, closeDatabase, sequelize } = require('../src/database/connection');
const { Product } = require('../src/models/product');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://postgres:postgres@localhost:5432/postgres_test';

// Global test setup
beforeAll(async () => {
  await initializeDatabase();
});

beforeEach(async () => {
  await Product.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
});


// Clean up after all tests
afterAll(async () => {
  await sequelize.close();

});

// Global test timeout
jest.setTimeout(30000);