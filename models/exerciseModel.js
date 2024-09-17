const pool = require('../config/database');

// Fetch all exercises
const getExercises = async (user_id, type) => {
  const query = 'SELECT * FROM all_exercises WHERE (user_id = COALESCE($1, user_id) OR user_id IS NULL) AND exercise_type = COALESCE($2, exercise_type)';
  if (type === 'all') type = null;
  const values = [user_id, type];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Fetch single exercise by its ID
const getExerciseById = async (exercise_id, user_id, type) => {
  const query = 'SELECT * FROM all_exercises WHERE exercise_id = $1 AND (user_id = COALESCE($2, user_id) OR user_id IS NULL) AND exercise_type = COALESCE($3, exercise_type)';
  if (user_id && !type) type = 'custom';
  else if (!type) type = 'standard';
  const values = [exercise_id, user_id, type];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Create new exercise
const postExercise = async (user_id, name, equipment, muscles) => {
  const query = `
    INSERT INTO custom_exercises (user_id, name, equipment, muscles)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [user_id, name, equipment, muscles];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Delete exercise
const deleteExercise = async (exercise_id) => {
  const query = 'DELETE FROM custom_exercises WHERE id = $1 RETURNING *';
  const values = [exercise_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  getExercises,
  getExerciseById,
  postExercise,
  deleteExercise
};