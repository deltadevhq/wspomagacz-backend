const userModel = require('../models/userModel');

// Get user
const getUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await userModel.getUser(userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { name } = req.body;
  try {
    const newUser = await userModel.createUser(name);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getUser,
  createUser,
};