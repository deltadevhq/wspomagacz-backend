const pool = require('../config/database');

// Fetch all users
const getUsers = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

// Insert a new user
const createUser = async (name) => {
  const result = await pool.query(
    'INSERT INTO users (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

module.exports = {
  getUsers,
  createUser,
};