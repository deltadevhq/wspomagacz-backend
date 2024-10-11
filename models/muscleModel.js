const pool = require('../config/database');

/**
 * Select all muscles from database
 */
const getMuscles = async () => {
  const query = 'SELECT * FROM muscles';

  try {
    const result = await pool.query(query);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Select single muscle from database by its ID
 */
const getMuscleById = async (muscle_id) => {
  const query = 'SELECT * FROM muscles WHERE id = $1';
  const values = [muscle_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  getMuscles,
  getMuscleById
};