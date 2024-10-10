const pool = require('../config/database');

// Fetch all workouts
const getWorkouts = async (user_id, status) => {
  const query = 'SELECT * FROM workouts WHERE user_id = COALESCE($1, user_id) AND status = COALESCE($2, status)';
  const values = [user_id, status];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Fetch single workout by its ID
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

// Create new workout
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

// Update workout
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

// Delete workout
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

// Start workout
const startWorkout = async (workout_id) => {
  const query = `
    UPDATE workouts
    SET 
        started_at = NOW(),
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

// Stop workout
const stopWorkout = async (workout_id) => {
  const query = `
    UPDATE workouts
    SET 
        started_at = null,
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

// Finish workout
const finishWorkout = async (workout_id) => {
  const query = `
    UPDATE workouts
    SET 
        finished_at = NOW(),
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

module.exports = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  startWorkout,
  stopWorkout,
  finishWorkout
};
