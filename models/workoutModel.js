const { pool } = require('../config/database');

/**
 * Selects workouts from the database based on the user ID, status, and date.
 *
 * @param {number|null} user_id - The ID of the user to filter workouts by (can be null).
 * @param {string|null} status - The status of the workouts to filter by (can be null).
 * @param {string|null} date - The date of the workouts to filter by (can be null).
 * @returns {Array|null} - An array of workout objects if found, or null if no workouts match the criteria.
 */
const selectWorkouts = async (user_id, status, date, offset = 0, limit = 10) => {
  const query = `
    SELECT * FROM workouts 
    WHERE user_id = COALESCE($1, user_id) 
    AND status = COALESCE($2, status) 
    AND date = COALESCE($3, date)
    ORDER BY date DESC
    LIMIT $4 OFFSET $5
  `;
  const values = [user_id, status, date, limit, offset];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : [];
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Counts the number of workouts that a user has completed.
 *
 * @param {number} user_id - The ID of the user whose completed workouts are being counted.
 * @returns {Array|null} - The count of completed workouts if successful, or null if the query fails.
 */
const selectUserCompletedWorkoutsCount = async (user_id) => {
  const query = `
    SELECT count(id) AS workout_count FROM workouts 
    WHERE user_id = $1 
    AND status = 'completed'
  `;
  const values = [user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Selects a workout from the database by its ID.
 *
 * @param {number} workout_id - The ID of the workout to select.
 * @returns {Object|null} - The workout object if found, or null if no workout was found with the specified ID.
 */
const selectWorkoutById = async (workout_id) => {
  const query = 'SELECT * FROM workouts WHERE id = $1';
  const values = [workout_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Selects a workout from the database by user ID and date.
 *
 * @param {number} user_id - The ID of the user whose workout to select.
 * @param {Date} date - The date of the workout to retrieve.
 * @returns {Object|null} - The workout object if found, or null if no workout was found for the given date.
 */
const selectWorkoutByDate = async (user_id, date) => {
  const query = 'SELECT * FROM workouts WHERE user_id = $1 and date = $2';
  const values = [user_id, date];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Retrieves the workout summary for a specified workout ID.
 *
 * @param {number} workout_id - ID of the workout to retrieve the summary for.
 * @returns {Object|null} - The workout summary if found, otherwise null.
 */
const selectWorkoutSummary = async (workout_id) => {
  const query = `
    SELECT * FROM workout_summaries_view wsv 
    WHERE wsv.id = $1
  `;
  const values = [workout_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Retrieves workout exercise statistics for a specified user, exercise, and exercise type.
 *
 * @param {number} user_id - The ID of the user whose exercise statistics are being retrieved.
 * @param {number} exercise_id - The ID of the exercise whose statistics are being retrieved.
 * @param {string} exercise_type - The type of the exercise (custom or standard) whose statistics are being retrieved.
 * @returns {Object|null} - The workout exercise statistics object if found, otherwise null.
 */
const selectWorkoutExerciseStats = async (user_id, exercise_id, exercise_type) => {
  const query = `
    SELECT e.*, ues.data, ues.personal_best FROM user_workout_exercise_stats ues
    JOIN exercises e ON e.id = ues.exercise_id
    WHERE ues.user_id = $1 
    AND ues.exercise_id = $2 
    AND ues.exercise_type = $3
  `;
  const values = [user_id, exercise_id, exercise_type];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Inserts a new workout into the database.
 *
 * @param {number} related_workout_id - The ID of the related workout, if any.
 * @param {number} user_id - The ID of the user creating the workout.
 * @param {string} name - The name of the workout.
 * @param {Array} exercises - The list of exercises for the workout.
 * @param {Date} date - The date of the workout.
 * @param {string|null} notes - Additional notes for the workout, or null if no notes are provided.
 * @returns {Object|null} - The newly created workout object if successful, or null if the insert failed.
 */
const insertWorkout = async (related_workout_id, user_id, name, exercises, date, notes) => {
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
}

/**
 * Inserts a new workout summary into the database.
 *
 * @param {number} workout_id - The ID of the related workout.
 * @param {number} experience_history_id - The ID of the user's experience history.
 * @param {number} duration - The duration of the workout in minutes.
 * @param {number} total_weight - The total weight lifted during the workout.
 * @returns {Object|null} - The newly created workout summary object if successful, or null if the insert failed.
 */
const insertWorkoutSummary = async (workout_id, experience_history_id, duration, total_weight) => {
  const query = `
    INSERT INTO workout_summaries (workout_id, experience_history_id, duration, total_weight)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [workout_id, experience_history_id, duration, total_weight];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Inserts a new workout achievement record into the database.
 *
 * @param {number} workout_summary_id - The ID of the workout summary associated with the achievement.
 * @param {number} user_achievement_id - The ID of the user achievement to associate with the workout.
 * @returns {Object|null} - The newly created workout achievement object if successful, or null if the insert failed.
 */
const insertWorkoutAchievement = async (workout_summary_id, user_achievement_id) => {
  const query = `
    INSERT INTO workout_achievements (workout_summary_id, user_achievement_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [workout_summary_id, user_achievement_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Updates a workout in the database by its ID.
 *
 * @param {number} workout_id - The ID of the workout to update.
 * @param {string|null} name - The new name of the workout, or null to keep the current name.
 * @param {Array|null} exercises - The new list of exercises, or null to keep the current exercises.
 * @param {Date|null} date - The new date of the workout, or null to keep the current date.
 * @param {string|null} notes - The new notes for the workout, or null to keep the current notes.
 * @returns {Object|null} - The updated workout object if successful, or null if no workout was found.
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
}

/**
 * Starts a workout by setting the started_at timestamp to the current time.
 *
 * @param {number} workout_id - The ID of the workout to start.
 * @returns {Object|null} - The updated workout object if successful, or null if no workout was found.
 */
const updateWorkoutWithStart = async (workout_id) => {
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
}

/**
 * Stops a workout by resetting the started_at timestamp to null.
 *
 * @param {number} workout_id - The ID of the workout to stop.
 * @returns {Object|null} - The updated workout object if successful, or null if no workout was found.
 */
const updateWorkoutWithStop = async (workout_id) => {
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
}

/**
 * Updates a workout to mark it as finished by setting the finished_at timestamp.
 *
 * @param {number} workout_id - The ID of the workout to update.
 * @returns {Object|null} - The updated workout object if successful, or null if no workout was found.
 */
const updateWorkoutWithFinish = async (workout_id) => {
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
}

/**
 * Deletes a workout from the database by its ID.
 *
 * @param {number} workout_id - The ID of the workout to delete.
 * @returns {Object|null} - The deleted workout object if successful, or null if no workout was found.
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
}

/**
 * Checks for workout collisions for a specified user on a given date.
 *
 * @param {number} user_id - The ID of the user for whom to check workouts.
 * @param {string} date - The date to check for existing workouts (formatted as 'YYYY-MM-DD').
 * @returns {Array|null} - An array of workouts if any exist for the user on the given date, or null if no workouts are found.
 */
const checkWorkoutCollision = async (user_id, date) => {
  const query = 'SELECT * FROM workouts WHERE user_id = $1 AND date = $2';
  const values = [user_id, date];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

module.exports = {
  selectWorkouts,
  selectUserCompletedWorkoutsCount,
  selectWorkoutById,
  selectWorkoutByDate,
  selectWorkoutSummary,
  selectWorkoutExerciseStats,
  insertWorkout,
  insertWorkoutSummary,
  insertWorkoutAchievement,
  updateWorkout,
  updateWorkoutWithStart,
  updateWorkoutWithStop,
  updateWorkoutWithFinish,
  deleteWorkout,
  checkWorkoutCollision,
  
}