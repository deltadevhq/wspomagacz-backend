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

/**
 * Updates the profile information of a user if the request is made by the logged-in user.
 *
 * @param {Request} req - The request object containing user ID and new profile data.
 * @param {Response} res - The response object used to send the updated user data or an error message.
 * @returns {void} - Sends a response with the updated user information or an error.
 */
const patchUser = async (req, res) => {
  try {
    const { id: user_id } = req.params;
    const { logged_user_id, display_name, gender, birthday, weights, height } = req.body;

    // Check if the request is for the currently logged-in user
    if (Number(user_id) !== logged_user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Serialize weights array into JSON string
    const parsed_weights = JSON.stringify(weights);

    // Check user existence
    const user = await userModel.selectUserById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update user data in database
    const patched_user = await userModel.updateUser(user_id, display_name, gender, birthday, parsed_weights, height);

    // Remove sensitive data before sending the response
    delete patched_user.password_hash;

    // Successful response with updated user data
    res.status(200).json(patched_user);
  } catch (error) {
    console.error('Error patching user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Deletes a user account if the request is made by the logged-in user.
 *
 * @param {Request} req - The request object containing the user ID to be deleted.
 * @param {Response} res - The response object used to send a confirmation message or an error.
 * @returns {void} - Sends a response confirming the deletion or an error message.
 */
const deleteUser = async (req, res) => {
  try {
    const { id: user_id } = req.params;
    const { logged_user_id } = req.body;

    // Check if the request is for the currently logged-in user
    if (Number(user_id) !== logged_user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check user existence
    const user = await userModel.selectUserById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Delete user from database
    await userModel.deleteUser(user_id);

    // Successful response confirming deletion
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.stack);
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
  patchUser,
  deleteUser,
  fetchUserAchievements,
  fetchUserAchievementById,
}