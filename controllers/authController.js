const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = process.env.API_SECRET;

// Get user data by username from token
const getUserByUsername = async (req, res) => {
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await authModel.getUserByUsername(decoded.username);

    // User associated to this token could be deleted 
    if (!user) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });
      return res.status(404).json({ message: 'Invalid user' });
    }

    delete user.password_hash;

    res.status(200).json({ user: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Register new user
const registerUser = async (req, res) => {
  const { username, displayName, password, email } = req.body;

  // TODO: VALIDATE BODY DATA

  try {
    // Check if the email is already taken
    let existingUser = await authModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'This email is already taken' });
    }

    // Check if the username is already taken
    existingUser = await authModel.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'This username is already taken' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await authModelModel.postUser(username, displayName, passwordHash, email);

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
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login to get JWT token cookie
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // CONSIDER: USER LOGIN BY EMAIL
  // TODO: VALIDATE BODY DATA

  try {
    if (username && password) {
      const user = await authModel.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      await authModel.updateUserLastLogin(username);

      const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
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
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = {
  getUserByUsername,
  registerUser,
  loginUser,
  logoutUser,
  verifyToken
};