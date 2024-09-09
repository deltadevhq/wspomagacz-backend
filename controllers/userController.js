const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = process.env.API_SECRET;

// Get user data
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

// Create new user
const postUser = async (req, res) => {
  const { username, displayName, password, email } = req.body;

  // TODO: REGISTER DATA VALIDATION
  // TODO: PASSWORD STRENGHT VALIDATION

  try {
    // Check if the email is already taken
    let existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'This email is already taken' });
    }

    // Check if the username is already taken
    existingUser = await userModel.findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'This username is already taken' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await userModel.postUser(username, displayName, passwordHash, email);

    // Create a JWT token
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, secretKey, {
      expiresIn: '7d',  // CONSIDER: DETERMINE TOKEN EXPIRE TIME / CONSIDER AUTOMATIC TOKEN RENEWAL
    });

    // Set the cookie with the token
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Error registering user:', error.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUser,
  postUser
};