// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');
const experienceModel = require('../models/experienceModel');
const activitiesModel = require('../models/activitiesModel');
const userModel = require('../models/userModel');

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
 * Handles user experience processing after a workout.
 *
 * @param {Object} workout - The workout object containing workout details.
 * @returns {Object} - Returns the history result of experience granted.
 */
const userExperienceHandler = async (workout) => {
  try {
    // Fetch user actual experience
    const user = await userModel.selectUserById(workout.user_id);
    if (!user) {
      throw new Error(`User with ID ${workout.user_id} not found.`);
    }

    const exp_before = user.exp;
    const lvl_before = user.level;

    // Calculate experience granted based on workout and user data
    const exp = await calculateExperience(workout.exercises, user);
    const multiplier = await calculateMultiplier(workout.user_id);
    const exp_granted = Math.round(exp * multiplier);

    // Calculate user experience after grant
    const exp_after = exp_before + exp_granted;
    const progression = await getLevelByXpHandler(exp_after);
    const lvl_after = progression.level;

    // Grant experience and level for user and insert row in history
    await experienceModel.insertExperience(workout.user_id, exp_after, lvl_after);
    const history_result = await experienceModel.insertExperienceHistory(workout.user_id, exp_granted, exp_before, exp_after, lvl_before, lvl_after);

    // Publish level up activity 
    if (lvl_before < lvl_after) {
      history_result.multiplier = multiplier;
      await activitiesModel.insertActivity(workout.user_id, 'level_up', history_result, workout.user_id, 'public');
    }

    return history_result;
  } catch (error) {
    console.error(`Error in user experience handler for workout id: ${workout.id}, user id: ${workout.user_id}:`, error.stack);
    throw new Error('Failed to process user experience after workout.');
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
const calculateExperience = async (exercises, user) => {
  try {
    let xp = 0;
    const bodyweight = user.weights ? [user.weights.length-1]?.weight ?? user.weights[user.weights.length-1].weight : 40;

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

    xp = Math.round(xp / 50);

    return xp;
  } catch (error) {
    console.error('Error calculating experience:', error.stack);
    throw new Error('Failed to calculate experience.');
  }
}

module.exports = {
  getLevelByXp,
  getXpByLevel,
  userExperienceHandler,
  calculateMultiplier,
  calculateExperience,
}