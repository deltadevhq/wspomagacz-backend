const { pool } = require('../config/database');

/**
 * Retrieves exercises from the database for a specified user and type.
 *
 * @param {number|null} user_id - The ID of the user whose exercises to retrieve. If null, retrieves exercises for all users.
 * @param {string|null} type - The type of exercises to filter by ('custom', 'standard', or 'all'). If 'all', retrieves all exercise types.
 * @returns {Array|null} - An array of exercise objects if found, or null if no exercises match the criteria.
 */
const selectExercises = async (user_id, type, offset = 0, limit = 20) => {
  const query = `
    SELECT * FROM all_exercises
    WHERE (user_id = COALESCE($1, user_id) OR user_id IS NULL) 
    AND exercise_type = COALESCE($2, exercise_type) 
    ORDER BY exercise_type DESC, exercise_id
    LIMIT $3 OFFSET $4
  `;
  if (type === 'all') type = null;
  const values = [user_id, type, limit, offset];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : [];
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Retrieves an exercise from the database by its ID.
 *
 * @param {number} exercise_id - The ID of the exercise to retrieve.
 * @param {number|null} user_id - The ID of the user to filter exercises. If null, retrieves exercises for all users.
 * @param {string|null} type - The type of exercise to filter ('custom' or 'standard'). Defaults to 'standard' if not provided.
 * @returns {Object|null} - The exercise object if found, or null if no exercise matches the criteria.
 */
const selectExerciseById = async (exercise_id, user_id, type) => {
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
}

/**
 * Inserts a new exercise into the database.
 *
 * @param {number} user_id - The ID of the user creating the exercise.
 * @param {string} name - The name of the exercise.
 * @param {string} equipment - The equipment needed for the exercise.
 * @param {string} muscles - The muscles targeted by the exercise.
 * @returns {Object|null} - The inserted exercise object if successful, or null if the insertion failed.
 */
const insertExercise = async (user_id, name, equipment, muscles) => {
  const query = 'SELECT insert_custom_exercise($1, $2, $3, $4)';
  const values = [name, equipment, muscles, user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Deletes an exercise from the database by its ID.
 *
 * @param {number} exercise_id - The ID of the exercise to delete.
 * @returns {Object|null} - The deleted exercise object if successful, or null if no exercise was found.
 */
const deleteExercise = async (exercise_id) => {
  const query = 'DELETE FROM custom_exercises WHERE id = $1 RETURNING *';
  const values = [exercise_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

module.exports = {
  selectExercises,
  selectExerciseById,
  insertExercise,
  deleteExercise,
}