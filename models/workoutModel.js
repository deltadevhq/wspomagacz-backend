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
const postWorkout = async (related_workout_id, user_id, name, exercises, date, notes) => {
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

// Patch workout
const patchWorkout = async (workout_id, name, exercises, date, started_at, finished_at, notes) => {
  const query = `
    UPDATE workouts
    SET 
        name = COALESCE($2, name),
        exercises = COALESCE($3, exercises),
        date = COALESCE($4, date),
        started_at = COALESCE($5, started_at),
        finished_at = COALESCE($6, finished_at),
        notes = COALESCE($7, notes)
    WHERE id = $1
    RETURNING *
  `;
  const values = [workout_id, name, exercises, date, started_at, finished_at, notes];

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

module.exports = {
  getWorkouts,
  getWorkoutById,
  postWorkout,
  patchWorkout,
  deleteWorkout
};
