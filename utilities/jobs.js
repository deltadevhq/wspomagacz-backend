const { pool } = require('../config/database');

/**
 * Closes all planned workouts for today that were not started by marking them as 'skipped'.
 *
 * This function updates the status of workouts that are planned but have a date 
 * earlier than today, indicating that they were not started.
 *
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
const closeSkippedWorkouts = async () => {
  console.log(`Starting closeSkippedWorkoutsJob`);
  const query = `
    UPDATE workouts
    SET status = 'skipped'
    WHERE date < now()::date
      AND status = 'planned'
  `;

  try {
    const result = await pool.query(query);
    console.log(`Finishing closeSkippedWorkoutsJob with ${result.rowCount} updated workouts`);
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Closes all workouts that are in progress but have not been finished 
 * for more than two hours by updating their finished_at timestamp.
 *
 * This function sets the finished_at field to the current time for workouts 
 * that have a status of 'in_progress' and were started at least two hours ago.
 *
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
const closeUnfinishedWorkouts = async () => {
  console.log(`Starting closeUnfinishedWorkoutsJob`);
  const query = `
    UPDATE workouts
    SET finished_at = now()
    WHERE date <= now() - INTERVAL '2 hours'
      AND status = 'in_progress'
  `;
  
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
  closeUnfinishedWorkouts,
}