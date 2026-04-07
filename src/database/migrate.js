require('dotenv').config();
const { initializeDatabase, closeDatabase } = require('./connection');

/**
 * Run database migrations
 */
async function runMigrations() {
  try {

    await initializeDatabase();

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };