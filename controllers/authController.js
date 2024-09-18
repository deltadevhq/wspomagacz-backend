const authModel = require('../models/authModel');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secret_key = process.env.API_SECRET;

// Get user data by username from token
const getCurrentLoggedUser = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user_id);

    // User associated to this token can be deleted in the meantime
    if (!user) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });
      return res.status(404).json({ error: 'Invalid user' });
    }

    delete user.password_hash;

    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Register new user
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  const display_name = username;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'One or more required parameters is missing' });
  }

  try {
    // Check if the email is already taken
    let existing_user = await authModel.getUserByEmail(email);
    if (existing_user) {
      return res.status(409).json({ error: 'This email is already taken' });
    }

    // Check if the username is already taken
    existing_user = await authModel.getUserByUsername(username);
    if (existing_user) {
      return res.status(409).json({ error: 'This username is already taken' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create the user
    const new_user = await authModel.postUser(username, display_name, password_hash, email);
    delete new_user.password_hash;

    res.status(201).json(new_user);
  } catch (error) {
    console.error('Error registering user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login to get JWT token cookie
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // CONSIDER: USER LOGIN BY EMAIL

  try {
    if (username && password) {
      const user = await authModel.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const is_match = await bcrypt.compare(password, user.password_hash);
      if (!is_match) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      await authModel.updateUserLastLogin(username);

      const token = jwt.sign({ id: user.id, username: user.username }, secret_key, {
        expiresIn: '7d', // CONSIDER: DETERMINE TOKEN EXPIRE TIME / CONSIDER AUTOMATIC TOKEN RENEWAL
      });

      // Set the cookie with the token
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict'
      });

      res.status(204).send();
    } else {
      return res.status(400).json({ error: 'Invalid login request' });
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout to remove JWT token cookie
const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    res.status(204).send();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify JWT token cookie
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secret_key);
    req.user_id = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = {
  getCurrentLoggedUser,
  registerUser,
  loginUser,
  logoutUser,
  verifyToken
};