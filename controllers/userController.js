const userModel = require('../models/userModel');

// Get user data
const getUser = async (req, res) => {
  const user_id = parseInt(req.params.id);

  if (isNaN(user_id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await userModel.getUserById(user_id);

    if (user) {
      delete user.password_hash;
      delete user.email;
      delete user.last_logged_at;
      delete user.created_at;
      delete user.modified_at;

      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Patch user data
const patchUser = async (req, res) => {
  const user_id = parseInt(req.params.id);
  const { display_name, gender, birthday, weights, height } = req.body;
  
  if (isNaN(user_id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // You can patch only currently logged user
  if (user_id != req.user_id) {
    return res.status(403).json({ error: 'Token does not have the required permissions' });
  }

  try {
    const user = await userModel.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const patched_user = await userModel.patchUser(user_id, display_name, gender, birthday, weights, height);
    delete patched_user.password_hash;

    return res.status(200).json(patched_user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUser,
  patchUser
};