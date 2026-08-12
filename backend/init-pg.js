// Script to initialize PostgreSQL database, tables, and seed data.
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initPostgres() {
  const dbName = process.env.DB_NAME || 'task_dashboard';
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgresql';
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '5432');

  console.log(`Connecting to PostgreSQL at ${host}:${port} as user '${user}'...`);

  // 1. Connect to default 'postgres' database to create 'task_dashboard' if it doesn't exist
  const defaultClient = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres'
  });

  try {
    await defaultClient.connect();
    console.log('Connected to PostgreSQL server.');

    // Check if database exists
    const dbCheck = await defaultClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (dbCheck.rows.length === 0) {
      console.log(`Database '${dbName}' does not exist. Creating database...`);
      await defaultClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database '${dbName}' created successfully!`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }

    await defaultClient.end();

  } catch (err) {
    console.error('PostgreSQL Connection Error:', err.message);
    console.log('\nPlease check that DB_PASSWORD in backend/.env matches your pgAdmin 4 postgres user password.');
    process.exit(1);
  }

  // 2. Connect to task_dashboard database and run schema.sql & seed.js
  const dbClient = new Client({
    host,
    port,
    user,
    password,
    database: dbName
  });

  try {
    await dbClient.connect();
    console.log(`Connected to database '${dbName}'.`);

    // Read and run schema.sql
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await dbClient.query(schemaSql);
    console.log('Successfully created tables (users, tasks, comments) in PostgreSQL!');

    await dbClient.end();

    // 3. Run seed.js
    console.log('Running database seed script...');
    const seed = require('./seed');
    await seed();

    console.log('\n PostgreSQL setup complete! Refresh pgAdmin 4 to view tables and data.');

  } catch (err) {
    console.error('Error running schema/seed:', err.message);
  }
}

initPostgres();
