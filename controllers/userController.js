const userModel = require('../models/userModel');
const userSchema = require('../schemas/userSchema');

/**
 * Get user profile data by its ID
 */
const getUserProfile = async (req, res) => {
  // Validate input data
  const { error } = userSchema.getUserProfileSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // Fetch user from database
    const user = await userModel.getUserById(req.params.id);

    // Check if anything was returned
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Omit sensitive fields using destructuring
    const { password_hash, email, last_logged_at, created_at, modified_at, ...publicUserData } = user;

    // Successful response with sanitized user data
    res.status(200).json(publicUserData);
  } catch (error) {
    console.error('Error fetching user by ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Patch user data by its ID (You can only patch currently logged user)
 */
const patchUser = async (req, res) => {
  // Validate input data
  const { error } = userSchema.patchUserSchema.validate({ id: req.params.id, ...req.body});
  if (error) return res.status(400).json({ error: error.details[0].message });

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
 * Delete user by its ID (You can only delete currently logged user)
 */
const deleteUser = async (req, res) => {
  // Validate input data
  const { error } = userSchema.deleteUserSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

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