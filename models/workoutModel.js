const { pool } = require('../config/database');

/**
 * Select all workouts from database
 */
const getWorkouts = async (user_id, status, date) => {
  const query = 'SELECT * FROM workouts WHERE user_id = COALESCE($1, user_id) AND status = COALESCE($2, status) AND date = COALESCE($3, date)';
  const values = [user_id, status, date];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Select single workout from database by its ID
 */
const getWorkoutById = async (workout_id) => {
  const query = 'SELECT * FROM workouts WHERE id = $1';
  const values = [workout_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Select workout with for specified user and date
 */
const getWorkoutByDate = async (user_id, date) => {
  const query = 'SELECT * FROM workouts WHERE user_id = $1 and date = $2';
  const values = [user_id, date];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Retrieves the workout summary for a specified workout ID.
 *
 * @param {number} workout_id - ID of the workout to retrieve the summary for.
 * @returns {Object|null} - The workout summary if found, otherwise null.
 */
const selectWorkoutSummary = async (workout_id) => {
  const query = 'SELECT * FROM workout_summaries WHERE workout_id = $1';
  const values = [workout_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Insert workout to database
 */
const createWorkout = async (related_workout_id, user_id, name, exercises, date, notes) => {
  const query = `
    INSERT INTO workouts (related_workout_id, user_id, name, exercises, date, status, notes)
    VALUES ($1, $2, $3, $4, $5, 'planned', $6)
    RETURNING *
  `;
  const values = [related_workout_id, user_id, name, exercises, date, notes];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Update workout in database by its ID
 */
const updateWorkout = async (workout_id, name, exercises, date, notes) => {
  const query = `
    UPDATE workouts
    SET 
        name = COALESCE($2, name),
        exercises = COALESCE($3, exercises),
        date = COALESCE($4, date),
        notes = COALESCE($5, notes)
    WHERE id = $1
    RETURNING *
  `;
  const values = [workout_id, name, exercises, date, notes];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Delete workout from database by its ID
 */
const deleteWorkout = async (workout_id) => {
  const query = 'DELETE FROM workouts WHERE id = $1 RETURNING *';
  const values = [workout_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Start workout by updating started_at column in database
 */
const startWorkout = async (workout_id) => {
  const query = `
    UPDATE workouts
    SET 
        started_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const values = [workout_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Stop workout by updating started_at column in database
 */
const stopWorkout = async (workout_id) => {
  const query = `
    UPDATE workouts
    SET 
        started_at = null
    WHERE id = $1
    RETURNING *
  `;
  const values = [workout_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Finish workout by updating finished_at column in database
 */
const finishWorkout = async (workout_id) => {
  const query = `
    UPDATE workouts
    SET 
        finished_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const values = [workout_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Check if provided workout date collide with user other workouts
 */
const checkWorkoutCollision = async (user_id, date) => {
  const query = 'SELECT * FROM workouts WHERE user_id = $1 AND date = $2';
  const values = [user_id, date];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  getWorkouts,
  getWorkoutById,
  getWorkoutByDate,
  selectWorkoutSummary,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  startWorkout,
  stopWorkout,
  finishWorkout,
  checkWorkoutCollision,
};
