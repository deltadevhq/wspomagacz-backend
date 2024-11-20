const { pool } = require('../config/database');

/**
 * Fetches all achievements from the database.
 *
 * @returns {Array|null} - Array of achievements, or null if none found.
 */
const selectAchievements = async () => {
  const query = `
    SELECT a.*, e.id AS exercise_id FROM achievements a
    LEFT JOIN achievement_exercises ae ON ae.achievement_id = a.id
    LEFT JOIN exercises e ON e.id = ae.exercise_id
  `;

  try {
    const result = await pool.query(query);
    return result.rows.length > 0 ? result.rows : [];
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
  const query = `
    SELECT a.*, e.id AS exercise_id FROM achievements a 
    LEFT JOIN achievement_exercises ae ON ae.achievement_id = a.id
    LEFT JOIN exercises e ON e.id = ae.exercise_id
    WHERE a.id = $1
  `;
  const values = [achievement_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Inserts or updates a user achievement.
 *
 * @param {number} user_id - The ID of the user.
 * @param {number} achievement_id - The ID of the achievement.
 * @param {number} current_value - The user's current progress value for the achievement.
 * @param {boolean} achieved - Whether the user has achieved the achievement.
 * @returns {Object|null} - The inserted/updated user achievement object if successful, or null if the insertion/update failed.
 */
const insertUserAchievement = async (user_id, achievement_id, current_value, achieved, experience_history_id) => {
  const query = `
    INSERT INTO user_achievements (user_id, achievement_id, current_value, achieved, experience_history_id)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_id, achievement_id) DO UPDATE SET current_value = $3, achieved = $4, experience_history_id = $5
    RETURNING *
  `;
  const values = [user_id, achievement_id, current_value, achieved, experience_history_id];

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
  insertUserAchievement,
}