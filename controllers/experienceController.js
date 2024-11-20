// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');
const achievementController = require('../controllers/achievementController');
const experienceModel = require('../models/experienceModel');
const achievementModel = require('../models/achievementModel');
const activitiesModel = require('../models/activitiesModel');
const notificationModel = require('../models/notificationModel');
const userModel = require('../models/userModel');

const EXPERIENCE_DIVIDER = 0.01;
const DEFAULT_BODY_WEIGHT = 40;
const PERSONAL_BEST_EXTRA_EXP = 20;

/**
 * Retrieves the level corresponding to a given amount of experience points (XP).
 *
 * @param {Request} req - Request object containing the XP as a query parameter.
 * @param {Response} res - Response object to send back the level data or an error message.
 * @returns {void} - Responds with the level and XP if successful, or an error if there is an issue.
 */
const getLevelByXp = async (req, res) => {
  try {
    // Convert XP to a number
    const xp = Number(req.query.xp);

    // Call the handler function to process the request
    const data = await getLevelByXpHandler(xp);

    // Successful response with level and the provided XP
    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting level by experience:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Calculates the user's level and experience progression based on provided XP.
 *
 * @param {number} xp - The amount of experience points to evaluate.
 * @returns {Object} - An object containing the user's level, XP, progress towards the next level, and missing XP for the next level.
 */
const getLevelByXpHandler = async (xp) => {
  try {
    // Calculate the user's current level based on the provided XP
    const level = await experienceModel.getLevelByXp(xp);

    // Calculate XP required for the current and next levels
    const current_level_xp = await experienceModel.getXpByLevel(level);
    const next_level_xp = await experienceModel.getXpByLevel(level + 1);

    // Calculate progress in percentage (0.0 - 1.0) and missing XP for the next level
    const progress = ((xp - current_level_xp) / (next_level_xp - current_level_xp));
    const missing_xp = next_level_xp - xp;

    // Return the calculated data
    return { level, xp, progress: Number(progress.toFixed(2)), missing_xp };
  } catch (error) {
    console.error('Error handling get level by experience:', error.stack);
    throw new Error('Failed to calculate level and XP progression.');
  }
}

/**
 * Handles requests to retrieve the experience points required for a specific level.
 *
 * @param {Request} req - Request object containing the desired level as a query parameter.
 * @param {Response} res - Response object to return the level and required experience points.
 * @returns {void} - Responds with the level and required experience points.
 */
const getXpByLevel = async (req, res) => {
  try {
    // Convert level to a number
    const level = Number(req.query.level);

    // Calculate experience needed for certain level
    const xp = await experienceModel.getXpByLevel(level);

    // Successful response with level and required xp
    res.status(200).json({ level: level, xp });
  } catch (error) {
    console.error('Error getting experience by level:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handles requests to grant experience points to users after a workout and
 * handle personal bests and achievements.
 *
 * @param {Object} workout - The workout data object, containing the user ID, exercises, and date.
 * @returns {Promise<Object>} - A promise that resolves with an object containing the granted
 *   experience points and an array of the user's achievements progress.
 */
const userExperienceHandler = async (workout) => {
  try {
    // Deconstruct workout data
    const { user_id: user_id, exercises: workout_exercises, date: workout_date } = workout;

    // Initialize sum of granted experience
    let sum_of_granted_xp = 0;

    // Fetch user weights
    const { weights: user_weights } = await userModel.selectUserById(user_id);

    // Calculate experience based on workout exercises
    const exp = calculateWorkoutExperience(workout_exercises, user_weights);

    // Calculate events multiplier for workout
    const multiplier = await calculateMultiplier(user_id);

    // Grant experience for workout
    const { exp_granted: workout_exp_granted, experience_history } = await grantExperienceHandler(user_id, exp, multiplier);
    sum_of_granted_xp += workout_exp_granted;

    // Grant experience for achievements
    let user_achievements = [];
    const achievements_progress = await achievementController.workoutAchievementsHandler(workout_exercises, user_id, user_weights);
    for (const achievement of achievements_progress) {
      const { achievement_id, current_value, achieved, exp } = achievement;
      let experience_history_id = null;

      if (achieved) {
        const { exp_granted, experience_history } = await grantExperienceHandler(user_id, exp);
        experience_history_id = experience_history.id;
        sum_of_granted_xp += exp_granted;

        await activitiesModel.insertActivity(user_id, 'achievement', achievement, user_id, 'public');
      }

      const user_achievement = await achievementModel.insertUserAchievement(user_id, achievement_id, current_value, achieved, experience_history_id);
      user_achievements.push(user_achievement);
    }

    // Grant experience for each personal best
    const pb_count = await personalBestHandler(workout_exercises, workout_date, user_id);
    for (let i = 0; i < pb_count; i++) {
      i = i + 1;
      const { exp_granted: pb_exp_granted } = await grantExperienceHandler(user_id, 1, PERSONAL_BEST_EXTRA_EXP);
      sum_of_granted_xp += pb_exp_granted;
    }

    return { sum_of_granted_xp, user_achievements, experience_history };
  } catch (error) {
    console.error(`Error in user experience handler for workout id: ${workout.id}, user id: ${workout.user_id}:`, error.stack);
    throw new Error('Failed to process user experience after workout.');
  }
}

/**
 * Grants experience points to a user and handles level up logic.
 * 
 * @param {number} user_id - The ID of the user
 * @param {number} exp - The experience points to be granted
 * @param {number} [multiplier=1.00] - The multiplier for the experience points
 * @returns {Promise<number>} - The granted experience points
 */
const grantExperienceHandler = async (user_id, exp = 0, multiplier = 1.00) => {
  try {
    // Fetch user actual experience
    const user = await userModel.selectUserById(user_id);

    const exp_before = user.exp;
    const lvl_before = user.level;

    const exp_granted = Math.round((exp * multiplier));

    const exp_after = exp_before + exp_granted;
    const progression = await getLevelByXpHandler(exp_after);
    const lvl_after = progression.level;

    // Grant experience and level for user and insert row in history
    await experienceModel.insertExperience(user_id, exp_after, lvl_after);
    const experience_history = await experienceModel.insertExperienceHistory(user_id, exp_granted, exp_before, exp_after, lvl_before, lvl_after);

    // Publish level up activity and send notification to user
    if (lvl_before < lvl_after) {
      experience_history.multiplier = multiplier;
      await activitiesModel.insertActivity(user_id, 'level_up', experience_history, user_id, 'public');
      await notificationModel.insertNotification(user_id, 'level_up', experience_history, user_id);
    }

    return { exp_granted, experience_history };
  } catch (error) {
    console.error(`Error in user experience handler for user id: ${user_id}:`, error.stack);
    throw new Error('Failed to process user experience.');
  }
}

/**
 * Calculates the experience multiplier based on user events.
 *
 * @param {number} user_id - The ID of the user for whom to calculate the multiplier.
 * @returns {number} - The total experience multiplier for the user.
 */
const calculateMultiplier = async (user_id) => {
  try {
    let total_multiplier = 1.00;
    const events = await experienceModel.selectEvents(user_id);

    // Sum multipliers from events
    events.forEach(event => {
      total_multiplier += --event.multiplier;
    });

    return total_multiplier;
  } catch (error) {
    console.error('Error executing query to fetch events:', error.stack);
    throw new Error('Failed to calculate experience multiplier.');
  }
}

/**
 * Calculates the total experience gained from a set of exercises performed by a user.
 *
 * @param {Array} exercises - An array of exercise objects containing details about the exercises performed.
 * @param {Object} user - The user object containing information such as weights.
 * @returns {number} - The total experience calculated based on the exercises.
 */
const calculateWorkoutExperience = (exercises, user_weights) => {
  try {
    let xp = 0;
    const bodyweight = user_weights ? user_weights[user_weights.length - 1] : DEFAULT_BODY_WEIGHT;

    // Sum XP from exercises
    for (const exercise_obj of exercises) {
      const exercise = exercise_obj.exercise;

      if (exercise.exercise_type === 'custom') break;

      // Use user body weight if no equipment is used else use equipment weight
      exercise_obj.sets.forEach(set => {
        if (exercise.equipment.length === 0) xp += set.reps * bodyweight;
        else xp += set.reps * set.weight;
      });
    }

    xp = Math.round(xp * EXPERIENCE_DIVIDER);

    return xp;
  } catch (error) {
    console.error('Error calculating experience:', error.stack);
    throw new Error('Failed to calculate experience.');
  }
}

/**
 * Handles personal bests for a user after completing a workout.
 *
 * @param {Array} exercises - An array of exercise objects containing details about the exercises performed.
 * @param {number} user_id - The ID of the user for whom to handle the personal bests.
 * @returns {Promise<number>} - A promise resolving to the number of personal bests set for the user during this workout.
 */
const personalBestHandler = async (exercises, date, user_id) => {
  try {
    let pb_count = 0;
    date = date.toLocaleDateString('sv-SE');

    for (const exercise_obj of exercises) {
      const exercise = exercise_obj.exercise;
      const sets = exercise_obj.sets;
      let weight_record = 0;

      for (const set of sets) {
        if (set.weight > weight_record) weight_record = set.weight;
      }

      // Fetch personal best for exercise from database - view automatically updates pb on workout finish so we only compare it by date to check if it match
      const { personal_best: exercise_pb } = await experienceModel.checkPersonalBestForExercise(exercise.exercise_id, exercise.exercise_type, user_id);
      if (exercise_pb.weight === weight_record && date === exercise_pb.date) {
        pb_count++;

        // If user completed exercise 5 or more times, insert activity
        const { count: total_exercise_completions } = await experienceModel.countTotalExerciseCompletions(exercise.exercise_id, exercise.exercise_type, user_id);
        if (total_exercise_completions >= 5) {
          await activitiesModel.insertActivity(user_id, 'personal_best', exercise_obj, user_id, 'public');
        }
      }

    }
    return pb_count;
  } catch (error) {
    console.error('Error handling personal bests:', error.stack);
    throw new Error('Failed to handle personal bests.');
  }
}

module.exports = {
  getLevelByXp,
  getXpByLevel,
  userExperienceHandler,
  calculateMultiplier,
  calculateWorkoutExperience,
  personalBestHandler,
  grantExperienceHandler,
}