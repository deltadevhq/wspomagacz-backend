const { pool } = require('../config/database');

// Close all workouts planned for today which were not even started
const closeSkippedWorkouts = async () => {
  console.log(`Starting closeSkippedWorkoutsJob`);
  const query = `UPDATE workouts SET status = 'skipped' WHERE "date" <= now() AND status = 'planned'`;

  try {
    const result = await pool.query(query);
    console.log(`Finishing closeSkippedWorkoutsJob with ${result.rowCount} updated workouts`);
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Close all in progress workouts which were not finished
const closeUnfinishedWorkouts = async () => {
  console.log(`Starting closeUnfinishedWorkoutsJob`);
  const query = `UPDATE workouts SET status = 'completed' WHERE "date" <= now() - INTERVAL '2 hours' AND status = 'in_progress'`;

  try {
    const result = await pool.query(query);
    console.log(`Finishing closeUnfinishedWorkoutsJob with ${result.rowCount} updated workouts`);
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  closeSkippedWorkouts,
  closeUnfinishedWorkouts
}