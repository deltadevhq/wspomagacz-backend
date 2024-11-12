const { pool } = require('../config/database');
const workoutController =  require('../controllers/workoutController');

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
    SELECT id, user_id FROM workouts
    WHERE started_at <= now() - INTERVAL '2 hours'
      AND status = 'in_progress'
  `;
  
  try {
    const result = await pool.query(query);
    let error_count = 0;

    for (const workout of result.rows) {
      const req = { params: { id: workout.id }, body: { logged_user_id: workout.user_id} }
      const message = await workoutController.finishWorkout(req)
      if (message) {
        console.error(message);
        error_count++;
      }
    };
    
    console.log(`Finishing closeUnfinishedWorkoutsJob with ${result.rowCount - error_count} updated workouts and ${error_count} errors`);
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  closeSkippedWorkouts,
  closeUnfinishedWorkouts,
}