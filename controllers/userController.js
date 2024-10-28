const userModel = require('../models/userModel');

/**
 * Function to handle requests for retrieving a user's public profile by their ID.
 * 
 * @param {Object} req - The request object containing the user ID as a route parameter.
 * @param {Object} res - The response object used to send back the user profile data.
 * @returns {void} - Responds with the user's public profile data if found, or an error message if the user is not available.
 * @throws {Error} - Throws an error if there is an issue fetching the user data from the database.
 */
const getUserProfile = async (req, res) => {
  try {
    // Fetch user from database
    const user = await userModel.getUserById(req.params.id);

    // Check if anything was returned
    if (!user) return res.status(404).json({ error: 'User not found' });

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
      height: user.height
    };

    // Successful response with sanitized user data
    res.status(200).json(publicUserData);
  } catch (error) {
    console.error('Error fetching user by ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Function to handle requests for updating an user by their ID.
 * 
 * @param {Object} req - The request object containing the user ID as a route parameter and the new data in the body.
 * @param {Object} res - The response object used to send back the updated user data.
 * @returns {void} - Responds with the updated user data if the update is successful, or an error message if the request fails.
 * @throws {Error} - Throws an error if:
 *   - The request is not for the currently logged-in user.
 *   - The user is not found.
 *   - An internal server error occurs during the update process.
 */
const patchUser = async (req, res) => {
  // Check if the request is for the currently logged-in user
  if (Number(req.params.id) !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

  // Serialize weights array into JSON string
  const parsed_weights = JSON.stringify(req.body.weights);

  try {
    // Fetch user from database  
    const user = await userModel.getUserById(req.params.id);

    // Check if anything was returned
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update user data in database
    const patched_user = await userModel.patchUser(req.params.id, req.body.display_name, req.body.gender, req.body.birthday, parsed_weights, req.body.height);

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
 * @param {Object} req - The request object containing the user ID as a route parameter.
 * @param {Object} res - The response object used to send back the result of the deletion request.
 * @returns {void} - Responds with a success message upon successful deletion or an error message if the request fails.
 * @throws {Error} - Throws an error if:
 *   - The request is not for the currently logged-in user.
 *   - The user is not found.
 *   - An internal server error occurs during the deletion process.
 */
const deleteUser = async (req, res) => {
  // Check if the request is for the currently logged-in user
  if (Number(req.params.id) !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

  try {
    // Fetch user from database
    const user = await userModel.getUserById(req.params.id);

    // Check if anything was returned
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

module.exports = {
  getUserProfile,
  patchUser,
  deleteUser
};