// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');
const { applicationSecret, applicationTokenExpirationTime } = require('../config/settings');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Function to handle the request for retrieving the currently logged-in user's data.
 *
 * @param {Request} req - Request object with user ID from the token.
 * @param {Response} res - Response object to send user data or an error message.
 * @returns {void} - Responds with user data on success, or clears the token and returns an error if the user is not found.
 * @throws {Error} - Throws an error if there is an issue fetching user data.
 */
const fetchCurrentLoggedUser = async (req, res) => {
  try {
    // Fetch user from database
    const user = await userModel.selectUserById(req.body.logged_user_id);

    // User associated to this token can be deleted in the meantime
    if (!user) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
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
 * @param {Request} req - Request object with user registration details in the body.
 * @param {Response} res - Response object to send back the new user data or an error.
 * @returns {void} - Responds with the created user data or an error if registration fails.
 * @throws {Error} - Throws an error if email or username is already taken, or if user creation fails.
 */
const registerUser = async (req, res) => {
  try {
    // Check if the email is already taken
    let existing_user = await userModel.selectUserByEmail(req.body.email);
    if (existing_user) return res.status(409).json({ error: 'This email is already taken' });

    // Check if the username is already taken
    existing_user = await userModel.selectUserByUsername(req.body.username);
    if (existing_user) return res.status(409).json({ error: 'This username is already taken' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(req.body.password, salt);

    // Create new user in the database
    const new_user = await userModel.insertUser(req.body.username, password_hash, req.body.email);

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
 * @param {Request} req - Request object with username and password in the body.
 * @param {Response} res - Response object to send login status or error.
 * @returns {void} - Responds with a JWT token if login is successful, or an error message if login fails.
 * @throws {Error} - Throws an error if user verification fails or if an internal error occurs.
 */
const loginUser = async (req, res) => {
  try {
    // Attempt to get the user by username or email
    let user;
    if (!req.body.username.includes('@')) {
      user = await userModel.selectUserByUsername(req.body.username);
    } else {
      user = await userModel.selectUserByEmail(req.body.username);
    }
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    // Check if provided password is correct
    const is_match = await bcrypt.compare(req.body.password, user.password_hash);
    if (!is_match) return res.status(401).json({ error: 'Invalid username or password' });

    // Update last login timestamp in database
    await userModel.updateUserLastLogin(user.username);

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, applicationSecret, {
      expiresIn: applicationTokenExpirationTime,
    });

    // Set the cookie with the token
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      sameSite: 'strict',
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
 * @param {Request} req - Request object containing user session information.
 * @param {Response} res - Response object to send logout status.
 * @returns {void} - Responds with a success status upon successful logout.
 * @throws {Error} - Throws an error if clearing the token fails.
 */
const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    // Successful logout response
    res.status(204).send();
  } catch (error) {
    console.error('Error logging out user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Updates the currently logged-in user's password.
 *
 * @param {Request} req - Request object with user ID and new password.
 * @param {Response} res - Response object to send a success message or error.
 * @returns {void} - Responds with a success message or an error if the update fails.
 * @throws {Error} - Throws an error if user is not found or if there's a server issue.
 */
const patchUserPassword = async (req, res) => {
  try {
    // Check user existence
    const user = await userModel.selectUserById(req.body.logged_user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate provided password against the current user password
    const is_match = await bcrypt.compare(req.body.password, user.password_hash);
    if (!is_match) return res.status(400).json({ error: 'Invalid password' });

    // Validate that the new password is not the same as the current password
    if (req.body.password === req.body.new_password) {
      return res.status(400).json({ error: 'New password cannot be the same as the current password' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(req.body.new_password, salt);

    // Update user password in the database
    await userModel.updateUserPassword(req.body.logged_user_id, password_hash);

    // Successful response
    res.status(201).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error patching user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Middleware to verify the authentication token from cookies.
 *
 * @param {Request} req - Request object containing the token in cookies.
 * @param {Response} res - Response object to send error status if token verification fails.
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
    const decoded = jwt.verify(token, applicationSecret);

    // Attach user ID from token to the request body
    req.body.logged_user_id = decoded.id;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired' });
    else if (error.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid token' });
    else return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = {
  fetchCurrentLoggedUser,
  registerUser,
  loginUser,
  logoutUser,
  patchUserPassword,
  verifyToken,
};
