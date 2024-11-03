const { pool } = require('../config/database');

/**
 * Select all achievements from database
 */
const selectAchievements = async () => {
  const query = 'SELECT * FROM achievements';

  try {
    const result = await pool.query(query);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  selectAchievements,
};
