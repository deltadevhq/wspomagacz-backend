// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');

const userModel = require('../models/userModel');

/**
 * Function to handle requests for retrieving a user's public profile by their ID or username.
 *
 * @param {Request} req - The request object containing either the user ID or username as a query parameter.
 * @param {Response} res - The response object used to send back the user profile data.
 * @returns {void} - Responds with the user's public profile data if found, or an error message if the user is not available.
 * @throws {Error} - Throws an error if there is an issue fetching the user data from the database.
 */
const searchUserProfile = async (req, res) => {
  try {
    const { id, username } = req.query;

    let user;
    if (username) user = await userModel.selectUserByUsername(username);
    else user = await userModel.selectUserById(id);

    // If no user is found, return a 404 response
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Construct an object with public user information
    const publicUserData = {
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
    res.status(200).json(publicUserData);
  } catch (error) {
    console.error('Error fetching user by ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Function to handle requests for updating a user by their ID.
 *
 * @param {Request} req - The request object containing the user ID as a route parameter and the new data in the body.
 * @param {Response} res - The response object used to send back the updated user data.
 * @returns {void} - Responds with the updated user data if the update is successful, or an error message if the request fails.
 * @throws {Error} - Throws an error if:
 *   - The request is not for the currently logged-in user.
 *   - The user is not found.
 *   - An internal server error occurs during the update process.
 */
const patchUser = async (req, res) => {
  // Check if the request is for the currently logged-in user
  if (Number(req.params.id) !== req.body.logged_user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

  // Serialize weights array into JSON string
  const parsed_weights = JSON.stringify(req.body.weights);

  try {
    // Check user existence
    const user = await userModel.selectUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update user data in database
    const patched_user = await userModel.updateUser(req.params.id, req.body.display_name, req.body.gender, req.body.birthday, parsed_weights, req.body.height);

    // Remove sensitive data before sending the response
    delete patched_user.password_hash;

    // Successful response with updated user data
    res.status(200).json(patched_user);
  } catch (error) {
    console.error('Error patching user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Function to handle requests for deleting a user by their ID.
 *
 * @param {Request} req - The request object containing the user ID as a route parameter.
 * @param {Response} res - The response object used to send back the result of the deletion request.
 * @returns {void} - Responds with a success message upon successful deletion or an error message if the request fails.
 * @throws {Error} - Throws an error if:
 *   - The request is not for the currently logged-in user.
 *   - The user is not found.
 *   - An internal server error occurs during the deletion process.
 */
const deleteUser = async (req, res) => {
  // Check if the request is for the currently logged-in user
  if (Number(req.params.id) !== req.body.logged_user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

  try {
    // Check user existence
    const user = await userModel.selectUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Delete user from database
    await userModel.deleteUser(req.params.id);

    // Successful response confirming deletion
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserAchievements = async (req, res) => {
  try {

    // TODO: IMPLEMENT getUserAchievements ENDPOINT
    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error fetching user achievements:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserAchievement = async (req, res) => {
  try {

    // TODO: IMPLEMENT getUserAchievement ENDPOINT
    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error fetching user achievement:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  searchUserProfile,
  patchUser,
  deleteUser,
  getUserAchievements,
  getUserAchievement,
};
