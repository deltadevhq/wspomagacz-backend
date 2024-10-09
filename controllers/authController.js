const authModel = require('../models/authModel');
const userModel = require('../models/userModel');
const userSchema = require('../schemas/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Get user data by its ID
const getCurrentLoggedUser = async (req, res) => {
  try {
    // Fetch user from database
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

    // Remove sensitive data before sending the response
    delete user.password_hash;

    // Successful response with current logged user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching currently logged user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Register new user
const registerUser = async (req, res) => {
  // Validate input data
  const { error } = userSchema.registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // Check if the email is already taken
    let existing_user = await authModel.getUserByEmail(req.body.email);
    if (existing_user) return res.status(409).json({ error: 'This email is already taken' });

    // Check if the username is already taken
    existing_user = await authModel.getUserByUsername(req.body.username);
    if (existing_user) return res.status(409).json({ error: 'This username is already taken' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(req.body.password, salt);

    // Create new user in the database
    const new_user = await authModel.postUser(req.body.username, password_hash, req.body.email);

    // Remove sensitive data before sending the response
    delete new_user.password_hash;

    // Successful response with created user data
    res.status(201).json(new_user);
  } catch (error) {
    console.error('Error registering user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login to get JWT token cookie
const loginUser = async (req, res) => {
  // Validate input data
  const { error } = userSchema.loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // OPTIONAL: USER LOGIN BY EMAIL
  // CONSIDER: DETERMINE TOKEN EXPIRE TIME / CONSIDER AUTOMATIC TOKEN RENEWAL

  try {
    // Check if the user exists
    const user = await authModel.getUserByUsername(req.body.username);
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    // Check if provided password is correct
    const is_match = await bcrypt.compare(req.body.password, user.password_hash);
    if (!is_match) return res.status(401).json({ error: 'Invalid username or password' });

    // Update last login timestamp in database
    await authModel.updateUserLastLogin(req.body.username);

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.API_SECRET, {
      expiresIn: '7d',
    });

    // Set the cookie with the token
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      sameSite: 'strict'
    });

    // Successful login response
    res.status(204).send();
  } catch (error) {
    console.error('Error logging in user:', error.stack);
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

    // Successful logout response
    res.status(204).send();
  } catch (error) {
    console.error('Error logging out user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify JWT token cookie
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  // Validation for missing token
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.API_SECRET);

    // Attach user ID from token to the request object
    req.user_id = decoded.id;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired' });
    else if (error.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid token' });
    else return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = {
  getCurrentLoggedUser,
  registerUser,
  loginUser,
  logoutUser,
  verifyToken
};