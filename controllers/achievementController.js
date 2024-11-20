const experienceModel = require('../models/experienceModel');
const achievementModel = require('../models/achievementModel');
const userModel = require('../models/userModel');

const DEFAULT_BODY_WEIGHT = 40;

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
const workoutAchievementsHandler = async (exercises, user_id, user_weights) => {
  // Select initial values from database
  const user_achievements = await userModel.selectUserAchievements(user_id);
  const all_achievements = await achievementModel.selectAchievements();

  // Calculate exercises progress
  const exercises_progress = await calculateExercisesProgress(exercises, user_weights, user_id);

  // Calculate achievements progress
  const achievements_progress = await calculateAchievementsProgress(exercises_progress, user_achievements, all_achievements, user_id);

  return achievements_progress;
};

const calculateExercisesProgress = async (exercises, user_weights, user_id) => {
  const bodyweight = user_weights ? user_weights[user_weights.length - 1] : DEFAULT_BODY_WEIGHT;
  let exercises_progress = [];

  for (const exercise_object of exercises) {
    const { exercise, sets } = exercise_object;
    const { exercise_id, exercise_type, equipment } = exercise;

    if (exercise_type === 'custom') break;

    const { personal_best: exercise_personal_best_object } = await experienceModel.checkPersonalBestForExercise(exercise_id, 'standard', user_id);
    const { weight: personal_best } = exercise_personal_best_object;
    let total_weight = 0;
    let total_reps = 0;

    for (const set of sets) {
      if (equipment.length > 0) total_weight += set.reps * set.weight;
      else total_weight += set.reps * bodyweight;
      total_reps += set.reps;
    }


    const exercise_progress_object = {
      exercise_id,
      personal_best,
      total_weight,
      total_reps
    };

    exercises_progress.push(exercise_progress_object);
  }

  return exercises_progress;
}

/**
 * Calculates user progress for achievements.
 *
 * @param {Array} exercises_progress - Exercises progress including personal bests and total weight and reps.
 * @param {Array} user_achievements - User achievements including current values and achievement IDs.
 * @param {Array} all_achievements - All achievements with their target values and types.
 * @param {number} user_id - User ID.
 * @returns {Promise<Array>} - A promise resolving to an array of achievement progress objects.
 */
const calculateAchievementsProgress = async (exercises_progress, user_achievements, all_achievements, user_id) => {
  let achievements_progress = [];

  const exercises_progress_ids = exercises_progress.map(exercise => exercise.exercise_id);
  const achievements = all_achievements.filter(achievement => exercises_progress_ids.includes(achievement.exercise_id));

  for (const achievement of achievements) {
    const { id: achievement_id, exercise_id, type, target_value, xp: exp } = achievement;

    const user_achievement = user_achievements.find(user_achievement => user_achievement.achievement_id === achievement_id);
    if (user_achievement?.achieved) {
      continue;
    }

    let current_value = user_achievement?.current_value || 0;

    const exercise_progress = exercises_progress.find(exercise => exercise.exercise_id === exercise_id);

    switch (type) {
      case 'exercise_weight':
        current_value += exercise_progress.total_weight;
        break;
      case 'exercise_reps':
        current_value += exercise_progress.total_reps;
        break;
      case 'exercise_pb':
        current_value = exercise_progress.personal_best;
        break;
      default:
        break;
    }

    const new_value = Math.min(current_value, target_value);
    
    const achievement_progress = {
      user_id,
      achievement_id,
      current_value: new_value,
      target_value,
      achieved: new_value >= target_value,
      exp,
    }

    achievements_progress.push(achievement_progress);
  }

  return achievements_progress;
}

module.exports = {
  fetchAchievements,
  fetchAchievementById,
  workoutAchievementsHandler
}