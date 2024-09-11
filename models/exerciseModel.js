const pool = require('../config/database');

// Fetch all exercises
const getExercises = async () => {
  try {
    const query = 'SELECT * FROM exercises';

    const result = await pool.query(query);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Fetch single exercise
const getExerciseById = async (exerciseId) => {
  try {
    const query = 'SELECT * FROM exercises WHERE id = $1';
    const values = [exerciseId];

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  getExercises,
  getExerciseById
};