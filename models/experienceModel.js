const { pool } = require('../config/database');

const baseLevelXp = 100;
const XpScalingFactor = 10;

/**
 * Function to calculate the level based on provided XP
 * 
 * @param {number} xp - The total XP earned by the user
 * @returns {number} - The level corresponding to the provided XP
 */
const getLevelByXp = (xp) => {
  let level = 1;

  // Loop through levels and calculate cumulative XP until the provided XP matches or exceeds the required XP
  while (true) {
    const requiredXPForNextLevel = getXpByLevel(level + 1);
    if (requiredXPForNextLevel > xp) break;
    level++;
  }

  return level;
}

/**
 * Function to calculate total required XP to reach a specific level
 * 
 * @param {number} level - The target level the user wants to reach
 * @returns {number} - The total required XP to reach the provided level
 */
const getXpByLevel = (level) => {
  if (level === 1) return 0;

  return (baseLevelXp + (XpScalingFactor * --level)) * level;
}

/**
 * Function to select events from database for a user within the current date range
 * 
 * @param {number} user_id - The ID of the user for whom events are being fetched
 * @returns {Array} - An array of event objects or a default event with a multiplier if no events are found
 */
const selectEvents = async (user_id) => {
  const query = `
    SELECT * FROM events 
    WHERE (user_id = $1 OR user_id IS NULL)
    AND start_date <= CURRENT_DATE 
    AND end_date >= CURRENT_DATE;
  `;
  const values = [user_id];

  try {
    const result = await pool.query(query, values);

    // If no events are found, return a default event with multiplier 1.00
    if (result.rows.length === 0) return [{ multiplier: 1.00 }];

    return result.rows;
  } catch (error) {
    console.error(`Error fetching events for user_id: ${user_id}. Query: ${query}`, error.stack);
    throw new Error('Database query failed while fetching events.');
  }
}

/**
 * Function to grant experience and level up a user
 * 
 * @param {number} user_id - The ID of the user
 * @param {number} exp - The experience points to be updated
 * @param {number} level - The level to be updated
 * @returns {Object} - An object with the updated user id, experience, and level
 */
const insertExperience = async (user_id, exp, level) => {
  const query = `
    UPDATE users 
    SET 
      exp = COALESCE($2, exp),
      level = COALESCE($3, level)
    WHERE id = $1
    RETURNING id, exp, level;
  `;
  const values = [user_id, exp, level];

  try {
    const result = await pool.query(query, values);

    // If no rows are returned, it means the update failed
    if (result.rows.length === 0) {
      throw new Error(`User with id ${user_id} not found or update failed.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error(`Error updating experience for user_id: ${user_id}`, error.stack);
    throw new Error('Database update failed while granting experience.');
  }
}

/**
 * Function to insert an experience history record for a user
 * 
 * @param {number} user_id - The ID of the user
 * @param {number} workout_id - The ID of the workout associated with the experience
 * @param {number} exp_granted - The amount of experience points granted
 * @param {number} exp_before - The user's experience points before the update
 * @param {number} exp_after - The user's experience points after the update
 * @param {number} lvl_before - The user's level before the update
 * @param {number} lvl_after - The user's level after the update
 * @returns {Object} - An object with the inserted record
 */
const insertExperienceHistory = async (user_id, exp_granted, exp_before, exp_after, lvl_before, lvl_after) => {
  const query = `
    INSERT INTO experience_history ( 
      user_id, 
      exp_granted, 
      exp_before, 
      exp_after, 
      lvl_before, 
      lvl_after
    ) 
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [user_id, exp_granted, exp_before, exp_after, lvl_before, lvl_after];

  try {
    const result = await pool.query(query, values);

    // If no rows are returned, it means the insert failed
    if (result.rows.length === 0) {
      throw new Error(`Failed to insert experience history for user_id: ${user_id}.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error(`Error inserting experience history for user_id: ${user_id}`, error.stack);
    throw new Error('Database insert failed while recording experience history.');
  }
}

/**
 * Retrieves the user's personal best from the database for a given exercise.
 * 
 * @param {number} exercise_id - The ID of the exercise for which to retrieve the personal best.
 * @param {number} user_id - The ID of the user whose personal best is to be retrieved.
 * @returns {Object} - An object with the personal best value or null if no personal best is recorded for the given exercise and user.
 */
const checkPersonalBestForExercise = async (exercise_id, exercise_type, user_id) => {
  const query = `
    SELECT personal_best FROM user_workout_exercise_stats
    WHERE exercise_id = $1 AND exercise_type = $2 AND user_id = $3;
  `;
  const values = [exercise_id, exercise_type, user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error checking personal best for user_id: ${user_id}, exercise_id: ${exercise_id}, exercise_type: ${exercise_type}`, error.stack);
    throw new Error('Database query failed while checking personal best.');
  }
}

/**
 * Counts the total number of times a specific exercise has been completed by a user.
 * 
 * @param {number} exercise_id - The ID of the exercise to count completions for.
 * @param {string} exercise_type - The type of the exercise ('custom' or 'standard').
 * @param {number} user_id - The ID of the user whose completions are being counted.
 * @returns {Object|null} - The count of completions if successful, or null if the query fails.
 */
const countTotalExerciseCompletions = async (exercise_id, exercise_type, user_id) => {
  const query = `
    SELECT jsonb_array_length(data) AS count
    FROM user_workout_exercise_stats
    WHERE exercise_id = $1 AND exercise_type = $2 AND user_id = $3
  `;
  const values = [exercise_id, exercise_type, user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error checking total exercise completions for user_id: ${user_id}, exercise_id: ${exercise_id}, exercise_type: ${exercise_type}`, error.stack);
    throw new Error('Database query failed while checking personal best.');
  }
}

module.exports = {
  getLevelByXp,
  getXpByLevel,
  selectEvents,
  insertExperience,
  insertExperienceHistory,
  checkPersonalBestForExercise,
  countTotalExerciseCompletions,
}