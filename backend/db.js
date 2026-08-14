// PostgreSQL Database Pool Connection
const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'task_dashboard',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgresql'
    };

const pool = new Pool(poolConfig);

// Helper function to run query and return rows
async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result.rows;
}

module.exports = {
  query
};

