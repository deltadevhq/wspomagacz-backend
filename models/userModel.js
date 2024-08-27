const pool = require('../config/database');

// Fetch all users
const getUser = async (userId) => {
  try {
    const query = 'SELECT id, username, display_name, gender, birthday, status, level, exp, weights, height, created_at FROM users WHERE id = $1';
    const values = [userId];

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
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
  getUser,
  createUser,
};