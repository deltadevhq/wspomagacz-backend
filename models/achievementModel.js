const { pool } = require('../config/database');

/**
 * Fetches all achievements from the database.
 *
 * @returns {Array|null} - Array of achievements, or null if none found.
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
}

/**
 * Fetches a single achievement from the database by its ID.
 *
 * @param {number} achievement_id - ID of the achievement to fetch.
 * @returns {Object|null} - Achievement object if found, or null if not found.
 */
const selectAchievementById = async (achievement_id) => {
  const query = 'SELECT * FROM achievements WHERE id = $1';
  const values = [achievement_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

module.exports = {
  selectAchievements,
  selectAchievementById,
}