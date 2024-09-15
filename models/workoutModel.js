const pool = require('../config/database');

// Fetch all workouts
const getWorkouts = async (userId, status) => {
  try {
    const query = 'SELECT * FROM workouts WHERE (user_id = COALESCE($1, user_id) OR user_id IS NULL) AND status = COALESCE($2, status)';

    if (status === 'all') status = null;
    const values = [userId, status];

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Fetch single workout
const getWorkoutById = async (workoutId) => {
  try {
    const query = 'SELECT * FROM workouts WHERE id = $1';
    const values = [workoutId];

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  getWorkouts,
  getWorkoutById
};