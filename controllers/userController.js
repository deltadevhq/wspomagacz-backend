const userModel = require('../models/userModel');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
  getUsers,
  createUser,
};