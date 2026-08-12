// User Repository - Handles database queries for Users
const db = require('../db');

async function getAllUsers() {
  const sql = `
    SELECT id, name, email, role, created_at 
    FROM users 
    ORDER BY name ASC
  `;
  return await db.query(sql);
}

async function getUserById(id) {
  const sql = `
    SELECT id, name, email, role, created_at 
    FROM users 
    WHERE id = $1
  `;
  const rows = await db.query(sql, [id]);
  return rows[0] || null;
}

async function getUserByEmail(email) {
  const sql = `
    SELECT id, name, email, password, role, created_at 
    FROM users 
    WHERE LOWER(email) = LOWER($1)
  `;
  const rows = await db.query(sql, [email]);
  return rows[0] || null;
}

async function createUser({ name, email, password, role }) {
  const sql = `
    INSERT INTO users (name, email, password, role) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, name, email, role, created_at
  `;
  const rows = await db.query(sql, [name, email, password, role || 'Developer']);
  return rows[0];
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser
};
