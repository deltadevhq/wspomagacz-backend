const pool = require('../config/database');

// Fetch single users
const getUser = async (userId) => {
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
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