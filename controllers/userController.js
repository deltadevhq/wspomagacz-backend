const userModel = require('../models/userModel');

// Get user data by its ID
const getUser = async (req, res) => {
  const user_id = Number(req.params.id);

  // Validate user ID
  if (isNaN(user_id) || user_id <= 0) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    // Fetch user from database
    const user = await userModel.getUserById(user_id);

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

// Patch user data
const patchUser = async (req, res) => {
  const user_id = Number(req.params.id);
  const { display_name, gender, birthday, weights, height } = req.body;

  // Validate user ID
  if (isNaN(user_id) || user_id <= 0) return res.status(400).json({ error: 'Invalid user ID' });

  // Check if the request is for the currently logged-in user
  if (user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

  try {
    // Fetch user from database
    const user = await userModel.getUserById(user_id);

    // Check if anything was returned
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update user data in database
    const patched_user = await userModel.patchUser(user_id, display_name, gender, birthday, weights, height);

    // Remove sensitive data before sending the response
    delete patched_user.password_hash;

    // Successful response with updated user data
    res.status(200).json(patched_user);
  } catch (error) {
    console.error('Error patching user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUser,
  patchUser
};