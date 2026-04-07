const { Sequelize } = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://postgres:postgres@localhost:5432/postgres';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV !== 'test' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

/**
 * Initialize database connection and sync models
 */
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models. Force true in test env to recreate tables.
    await sequelize.sync({ force: process.env.NODE_ENV === 'test' });
    console.log('All models were synchronized successfully.');
    
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
async function closeDatabase() {
  await sequelize.close();
}

/**
 * Reset database (for testing)
 */
async function resetDatabase() {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync({ force: true });
  }
}

module.exports = {
  sequelize,
  initializeDatabase,
  closeDatabase,
  resetDatabase
};