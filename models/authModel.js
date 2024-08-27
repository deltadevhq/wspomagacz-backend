const pool = require('../config/database');

// Fetch all users
const getUser = async (username) => {
  try {
    const query = 'SELECT id, username, email, password_hash FROM users WHERE username = $1';
    const values = [username];

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  getUser
};