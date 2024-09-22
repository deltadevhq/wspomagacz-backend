const pool = require('../config/database');

// Close all workouts planned for today which were not even started
const closeSkippedWorkouts = async () => {
  console.log(`[${new Date().toLocaleString()}] Starting closeSkippedWorkoutsJob`);
  const query = `UPDATE workouts SET status = 'skipped' WHERE "date" <= now() AND status = 'planned'`;

  try {
    const result = await pool.query(query);
    console.log(`[${new Date().toLocaleString()}] Finishing closeSkippedWorkoutsJob with ${result.rowCount} updated workouts`);
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Close all in progress workouts which were not finished
const closeUnfinishedWorkouts = async () => {
  console.log(`[${new Date().toLocaleString()}] Starting closeUnfinishedWorkoutsJob`);
  const query = `UPDATE workouts SET status = 'completed' WHERE "date" <= now() AND status = 'in_progress'`;

  try {
    const result = await pool.query(query);
    console.log(`[${new Date().toLocaleString()}] Finishing closeUnfinishedWorkoutsJob with ${result.rowCount} updated workouts`);
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  closeSkippedWorkouts,
  closeUnfinishedWorkouts
}