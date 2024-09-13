const userModel = require('../models/userModel');

// Get user data
const getUser = async (req, res) => {
  const userId = parseInt(req.params.id);

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

// Get user exercises
const getUserExercises = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const exercises = await userModel.getUserExercises(userId);

    if (exercises) {
      res.json(exercises);
    } else {
      res.status(404).json({ error: 'There are no exercises for this user' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUser,
  patchUser,
  getUserExercises
};