// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');
const userModel = require('../models/userModel');
const system_user_id = 1;

/**
 * Fetches user profiles by username, with optional pagination.
 *
 * @param {Request} req - The request object containing the query parameters: username, limit, and offset.
 * @param {Response} res - The response object used to send the list of user profiles or an error message.
 * @returns {void} - Sends a response with an array of user profiles or an error message if the fetch fails.
 */
const fetchUserProfileByUsername = async (req, res) => {
  try {
    const { username, offset, limit } = req.query;

    const users = await userModel.selectUsersByUsername(username, offset, limit);

    let public_users_data = [];
    users.forEach((user) => {

      // Construct an object with public user information
      const public_user_data = {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        gender: user.gender,
        birthday: user.birthday,
        status: user.status,
        level: user.level,
        exp: user.exp,
        weights: user.weights,
        height: user.height,
      };

      public_users_data.push(public_user_data);
    });

    // Successful response with sanitized user data
    res.status(200).json(public_users_data);
  } catch (error) {
    console.error('Error fetching user by username:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Fetches a user profile by their user ID.
 *
 * @param {Request} req - The request object containing the user ID as a route parameter.
 * @param {Response} res - The response object used to send the user profile or an error message.
 * @returns {void} - Sends a response with the user profile or an error message if the fetch fails.
 */
const fetchUserProfileById = async (req, res) => {
  try {
    const { id: user_id } = req.params;

    const user = await userModel.selectUserById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Construct an object with public user information
    const public_user_data = {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      gender: user.gender,
      birthday: user.birthday,
      status: user.status,
      level: user.level,
      exp: user.exp,
      weights: user.weights,
      height: user.height,
    };

    // Successful response with sanitized user data
    res.status(200).json(public_user_data);
  } catch (error) {
    console.error('Error fetching user by ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Fetches user achievements by user ID.
 *
 * @param {Request} req - The request object containing the user ID in the route parameters.
 * @param {Response} res - The response object used to send the user's achievements or an error message.
 * @returns {void} - Sends a response with the user's achievements or an error.
 */
const fetchUserAchievements = async (req, res) => {
  try {
    const { id: user_id } = req.params;

    // Check user existence
    const user = await userModel.selectUserById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch user achievements
    const user_achievements = await userModel.selectUserAchievements(user_id);

    // Return the user's achievements
    return res.status(200).json(user_achievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Fetches a specific user achievement by user ID and achievement ID.
 *
 * @param {Request} req - The request object containing the user ID and achievement ID in the route parameters.
 * @param {Response} res - The response object used to send the user's achievement or an error message.
 * @returns {void} - Sends a response with the user's achievement or an error.
 */
const fetchUserAchievementById = async (req, res) => {
  try {
    const { id: user_id, achievement_id } = req.params;

    // Check user existence
    const user = await userModel.selectUserById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch user achievements
    const user_achievement = await userModel.selectUserAchievementById(user_id, achievement_id);
    if (!user_achievement) return res.status(404).json({ error: 'User achievements not found' });

    // Return the user's achievements
    return res.status(200).json(user_achievement);
  } catch (error) {
    console.error('Error fetching user achievement:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Fetches the exercise statistics for a specific user and exercise.
 *
 * @param {Request} req - The request object containing the user ID and exercise ID in the route parameters.
 * @param {Response} res - The response object used to send the user's exercise statistics or an error message.
 * @returns {void} - Sends a response with the user's exercise statistics or an error.
 */
const fetchUserExerciseStats = async (req, res) => {
  try {
    const { id: user_id, exercise_id } = req.params;

    // Check user existence
    const user = await userModel.selectUserById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch user exercise stats
    const user_exercise_stats = await userModel.selectUserExerciseStats(user_id, exercise_id);

    // Return the user's exercise stats
    return res.status(200).json(user_exercise_stats);
  } catch (error) {
    console.error('Error fetching user exercise stats:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}


/**
 * Fetches the user's avatar from the database.
 *
 * @param {Request} req - The request object containing the user ID.
 * @param {Response} res - The response object to send the avatar image.
 * @returns {void}
 */
const fetchUserAvatar = async (req, res) => {
  try {
    const { id: user_id } = req.params;

    // Fetch the user's avatar from the database
    let userAvatar;
    userAvatar = await userModel.selectUserAvatarById(user_id);
    if (!userAvatar) userAvatar = await userModel.selectUserAvatarById(system_user_id);
    if (!userAvatar) return res.status(404).json({ error: 'User avatar not found' });

    // Set the response header to the appropriate content type
    res.setHeader('Content-Type', 'image/jpeg');

    // Send the avatar image as a binary stream
    res.send(userAvatar.avatar);
  } catch (error) {
    console.error('Error fetching user avatar:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  fetchUserProfileByUsername,
  fetchUserProfileById,
  fetchUserAchievements,
  fetchUserAchievementById,
  fetchUserExerciseStats,
  fetchUserAvatar,
}