const authModel = require('../models/authModel');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Function to handle the request for retrieving the currently logged-in user's data.
 * 
 * @param {Object} req - Request object with user ID from the token.
 * @param {Object} res - Response object to send user data or an error message.
 * @returns {void} - Responds with user data on success, or clears the token and returns an error if the user is not found.
 * @throws {Error} - Throws an error if there is an issue fetching user data.
 */
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

/**
 * Function to handle the request for registering a new user
 * 
 * @param {Object} req - Request object with user registration details in the body.
 * @param {Object} res - Response object to send back the new user data or an error.
 * @returns {void} - Responds with the created user data or an error if registration fails.
 * @throws {Error} - Throws an error if email or username is already taken, or if user creation fails.
 */
const registerUser = async (req, res) => {
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

/**
 * Handles user login request by verifying credentials and generating a JWT.
 * 
 * @param {Object} req - Request object with username and password in the body.
 * @param {Object} res - Response object to send login status or error.
 * @returns {void} - Responds with a JWT token if login is successful, or an error message if login fails.
 * @throws {Error} - Throws an error if user verification fails or if an internal error occurs.
 */
const loginUser = async (req, res) => {
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

/**
 * Handles user logout request by clearing the authentication token.
 * 
 * @param {Object} req - Request object containing user session information.
 * @param {Object} res - Response object to send logout status.
 * @returns {void} - Responds with a success status upon successful logout.
 * @throws {Error} - Throws an error if clearing the token fails.
 */
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

/**
 * Middleware to verify the authentication token from cookies.
 * 
 * @param {Object} req - Request object containing the token in cookies.
 * @param {Object} res - Response object to send error status if token verification fails.
 * @param {Function} next - Callback to proceed to the next middleware or route handler.
 * @returns {void} - Calls next() if the token is valid; otherwise, responds with an error.
 * @throws {Error} - Throws an error for missing, expired, or invalid tokens.
 */
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