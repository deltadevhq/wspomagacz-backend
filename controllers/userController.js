const userModel = require('../models/userModel');

// Get user data
const getUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  // TODO: VALIDATE PARAMS DATA

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await userModel.getUser(userId);

    if (user) {
      delete user.password_hash;
      res.json(user);
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
  const userId = parseInt(req.params.id);
  const { displayName, gender, birthday, weights, height } = req.body;

  // TODO: VALIDATE PARAMS DATA
  // TODO: VALIDATE BODY DATA

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await userModel.getUser(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await userModel.patchUser(userId, displayName, gender, birthday, weights, height);
    delete updatedUser.password_hash;

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUser,
  patchUser
};