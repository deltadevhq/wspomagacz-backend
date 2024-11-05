// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');
const userModel = require('../models/userModel');

/**
 * Searches for a user profile by ID or username and returns public user information.
 *
 * @param {Request} req - The request object containing either the user ID or username as query parameters.
 * @param {Response} res - The response object used to send the user data or an error message.
 * @returns {void} - Sends a response with the user's public information or an error.
 */
const searchUserProfile = async (req, res) => {
  try {
    const { id: user_id, username } = req.query;

    let user;
    if (username) user = await userModel.selectUserByUsername(username);
    else user = await userModel.selectUserById(user_id);

    // If no user is found, return a 404 response
    if (!user) return res.status(404).json({ error: 'User not found.' });

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

const fetchUserAchievements = async (req, res) => {
  try {

    // TODO: IMPLEMENT getUserAchievements ENDPOINT
    res.status(501).json({ error: 'Not implemented' });

  } catch (error) {
    console.error('Error fetching user achievements:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const fetchUserAchievementById = async (req, res) => {
  try {

    // TODO: IMPLEMENT getUserAchievement ENDPOINT
    res.status(501).json({ error: 'Not implemented' });

  } catch (error) {
    console.error('Error fetching user achievement:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  searchUserProfile,
  fetchUserAchievements,
  fetchUserAchievementById,
}