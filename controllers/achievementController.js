const achievementModel = require('../models/achievementModel');
const userModel = require('../models/userModel');
const exercisesAchievementsHandler = require('./achievements/exercisesAchievements');
const workoutAchievementsHandler = require('./achievements/workoutAchievements');

/**
 * Fetches user achievements.
 *
 * @param {Request} req - Request object.
 * @param {Response} res - Response object for sending results.
 * @returns {void} - Responds with achievements or an error message.
 */
const fetchAchievements = async (req, res) => {
  try {
    // Fetch achievements from database
    const achievements = await achievementModel.selectAchievements();

    // Check if any achievements were returned
    if (!achievements) return res.status(404).json({ error: 'Achievements not found' });

    // Successful response with all achievements
    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Fetches a single achievement by its ID.
 *
 * @param {Request} req - Request object.
 * @param {Response} res - Response object for sending results.
 * @returns {void} - Responds with the achievement or an error message.
 */
const fetchAchievementById = async (req, res) => {
  try {
    const { id: achievement_id } = req.params;

    // Fetch achievement from database
    const achievement = await achievementModel.selectAchievementById(achievement_id);

    // Check if the achievement was found
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });

    // Successful response with the achievement
    res.status(200).json(achievement);
  } catch (error) {
    console.error('Error fetching achievement:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handles achievements progress after a workout.
 *
 * @param {Array} exercises - An array of exercise objects containing details about the exercises performed.
 * @param {number} user_id - The ID of the user for whom to handle the achievements.
 * @param {Array} user_weights - An array of the user's weights in order, with the latest weight at the end.
 * @returns {Promise<Array>} - A promise that resolves with an array of the user's achievements progress.
 */
const postWorkoutAchievementsHandler = async (exercises, user_id, user_weights) => {
  const achievements_progress = [];

  // Select initial values from database
  const user_achievements = await userModel.selectUserAchievements(user_id);
  const all_achievements = await achievementModel.selectAchievements();

  // Calculate exercises progress
  const { exercises_progress, workout_total_weight } = await exercisesAchievementsHandler.calculateExercisesProgress(exercises, user_weights, user_id);

  // Calculate achievements from exercise scope
  const exercises_achievements_progress = await exercisesAchievementsHandler.calculateExercisesAchievementsProgress(exercises_progress, user_achievements, all_achievements, user_id);

  // Calculate achievements from workout scope
  const workout_achievements_progress = await workoutAchievementsHandler.calculateWorkoutAchievementsProgress(workout_total_weight, user_achievements, all_achievements, user_id);

  return achievements_progress.concat(exercises_achievements_progress, workout_achievements_progress);
};

module.exports = {
  fetchAchievements,
  fetchAchievementById,
  postWorkoutAchievementsHandler
}