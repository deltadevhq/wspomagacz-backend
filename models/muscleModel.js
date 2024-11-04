const { pool } = require('../config/database');

/**
 * Retrieves all muscles from the database.
 *
 * @returns {Array|null} - An array of muscle objects if found, or null if no muscles exist.
 */
const selectMuscles = async () => {
  const query = 'SELECT * FROM muscles';

  try {
    const result = await pool.query(query);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Retrieves a single muscle from the database by its ID.
 *
 * @param {number} muscle_id - The ID of the muscle to retrieve.
 * @returns {Object|null} - The muscle object if found, or null if no muscle exists with the given ID.
 */
const selectMuscleById = async (muscle_id) => {
  const query = 'SELECT * FROM muscles WHERE id = $1';
  const values = [muscle_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

module.exports = {
  selectMuscles,
  selectMuscleById,
}