const pool = require('../config/database');

// Fetch user password hash for login
const getUserCredentials = async (username) => {
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Update last_logged_at column on user login
const updateLastLogin = async (username) => {
  try {
    const query = 'UPDATE users SET last_logged_at = NOW() WHERE username = $1';
    const values = [username];

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  getUserCredentials,
  updateLastLogin
};