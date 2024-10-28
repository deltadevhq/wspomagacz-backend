const experienceModel = require('../models/experienceModel');
const userModel = require('../models/userModel');
// const notificationModel = require('../models/notificationModel');

/**
 * Function to handle the request for the user's level based on provided experience points (XP).
 * @param {Object} req - The request object containing the XP query parameter.
 * @param {Object} res - The response object used to send back the results.
 * @returns {void} - Responds with the user's level, provided XP, progress, and missing XP.
 * @throws {Error} - Throws an error if there is an issue fetching the level or if the input is invalid.
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
};

/**
 * Function to calculate the level, progress, and XP details based on provided experience points (XP).
 * @param {number} xp - The total XP earned by the user.
 * @returns {Object} - Returns the user's level, progress, and missing XP for the next level.
 * @throws {Error} - Throws an error if there is an issue fetching the XP or level information.
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
};

/**
 * Function to handle the request for experience points required to reach a specified level.
 * @param {Object} req - The request object containing the level query parameter.
 * @param {Object} res - The response object used to send back the results.
 * @returns {void} - Responds with the required XP for the specified level.
 * @throws {Error} - Throws an error if there is an issue fetching the XP or if the input is invalid.
 */
const getXpByLevel = async (req, res) => {
  try {
    // Calculate experience needed for certain level
    const xp = await experienceModel.getXpByLevel(Number(req.query.level));

    // Successful response with level and required xp
    res.status(200).json({ level: Number(req.query.level), xp });
  } catch (error) {
    console.error('Error getting experience by level:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Function to handle user experience after a workout.
 * This includes fetching the user's current experience, calculating 
 * the experience earned from the workout, determining if the user levels up, 
 * and recording the experience history.
 *
 * @param {Object} workout - The workout object containing details about the workout.
 * @param {number} workout.id - The ID of the workout.
 * @param {number} workout.user_id - The ID of the user performing the workout.
 * @param {Array} workout.exercises - The exercises included in the workout.
 * @returns {Object} - The result of inserting the experience history.
 * @throws {Error} - Throws an error if the user is not found or if processing fails.
 */
const userExperienceHandler = async (workout) => {
  console.log(`Start user experience handler for workout id: ${workout.id}, user id: ${workout.user_id}`);
  try {
    // Fetch user actual experience
    const user = await userModel.getUserById(workout.user_id);
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

    // Emit level up notification for user
    if (lvl_before < lvl_after) {
      // await notificationModel.sendNotification(workout.user_id, `Congratulations! You've leveled up to Level ${lvl_after}!`, 'level_up');
      console.log(`Level up from ${lvl_before} to ${lvl_after} for user id: ${workout.user_id} `);
    }

    // Grant experience and level for user and insert row in history
    const result = await experienceModel.grantExperience(workout.user_id, exp_after, lvl_after);
    let history_result;
    if (result) {
      history_result = await experienceModel.insertExperienceHistory(workout.user_id, workout.id, exp_granted, exp_before, exp_after, lvl_before, lvl_after);
    }
    // TODO: EXTRA EXPERIENCE FOR EACH PERSONAL RECORD
    // TODO: EXTRA EXPERIENCE FOR EACH ARCHIEVEMENT
    // TODO: CHECK IF WORKOUT IS RANKED - ONLY TODAYS WORKOUTS

    console.log(`Finished user experience handler with XP granted: ${history_result.exp_granted}`);
    return history_result;
  } catch (error) {
    console.error(`Error in user experience handler for workout id: ${workout.id}, user id: ${workout.user_id}:`, error.stack);
    throw new Error('Failed to process user experience after workout.');
  }
};

/**
 * Function to calculate the total experience multiplier for a user based on active events.
 * @param {number} user_id - The ID of the user for which to calculate the multiplier.
 * @returns {number} - The total multiplier applied to the user's experience.
 * @throws {Error} - Throws an error if there is an issue fetching events.
 */
const calculateMultiplier = async (user_id) => {
  let total_multiplier = 1.00;

  try {
    const events = await experienceModel.fetchEvents(user_id);

    // Sum multipliers from events
    events.forEach(event => {
      total_multiplier += --event.multiplier;
    });

    console.log(`Total multiplier: ${total_multiplier.toFixed(2)}`);
    return total_multiplier;
  } catch (error) {
    console.error('Error executing query to fetch events:', error.stack);
    throw new Error('Failed to calculate experience multiplier.');
  }
};

/**
 * Function to calculate the total experience points based on the user's exercises.
 * @param {Array} exercises - The list of exercises performed by the user.
 * @param {Object} user - The user object containing user information.
 * @param {Array} user.weights - An array of weight objects for the user.
 * @returns {number} - The total experience points earned by the user.
 * @throws {Error} - Throws an error if there is an issue during calculation.
 */
const calculateExperience = async (exercises, user) => {
  let xp = 0;

  try {
    const bodyweight = user.weights ? [0]?.weight ?? user.weights[0].weight : 40;

    // Sum XP from exercises
    for (const exercise_obj of exercises) {
      const exercise = exercise_obj.exercise;

      if (exercise.exercise_type === 'custom') break;

      // Use user body weight if no equipment is used else use equipment weight
      exercise_obj.sets.forEach(set => {
        if (exercise.equipment.length === 0) {
          xp += set.reps * bodyweight;
          console.log(`Added XP using body weight: ${set.reps} * ${bodyweight}`);
        } else {
          xp += set.reps * set.weight;
          console.log(`Added XP using equipment weight: ${set.reps} * ${set.weight}`);
        }
      });
    }

    xp = Math.round(xp / 50);

    console.log(`Total experience: ${xp}`);
    return xp;
  } catch (error) {
    console.error('Error calculating experience:', error.stack);
    throw new Error('Failed to calculate experience.');
  }
};

module.exports = {
  getLevelByXp,
  getXpByLevel,
  userExperienceHandler,
  calculateMultiplier,
  calculateExperience,
};
