const pool = require('../config/database');

// Fetch single users
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

module.exports = {
  getUser
};