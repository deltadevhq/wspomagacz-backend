// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');
const { multer } = require('multer');
const { application_secret, application_token_expiration_time } = require('../config/settings');
const { resizeAndCropImage } = require('../utilities/middleware/fileUpload');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Retrieves the currently logged-in user's data and sends it in the response.
 *
 * @param {Request} req - The request object containing the logged user's ID.
 * @param {Response} res - The response object used to send user data or an error message.
 * @returns {void} - Responds with user data or clears the token and returns an error if the user is not found.
 */
const fetchCurrentLoggedUser = async (req, res) => {
  try {
    const { logged_user_id } = req.body;

    // Fetch user from database
    const user = await userModel.selectUserById(logged_user_id);

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
}

/**
 * Handles user registration, creating a new user in the database.
 *
 * @param {Request} req - The request containing user registration details in the body.
 * @param {Response} res - The response to send back the created user data or an error.
 * @returns {void} - Responds with new user data or an error if registration fails.
 */
const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if the email is already taken
    let existing_user = await userModel.selectUserByEmail(email);
    if (existing_user) return res.status(409).json({ error: 'This email is already taken' });

    // Check if the username is already taken
    existing_user = await userModel.selectUserByUsername(username);
    if (existing_user) return res.status(409).json({ error: 'This username is already taken' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user in the database
    const new_user = await userModel.insertUser(username, password_hash, email);

    // Remove sensitive data before sending the response
    delete new_user.password_hash;

    // Successful response with created user data
    res.status(201).json(new_user);
  } catch (error) {
    console.error('Error registering user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handles user login by verifying credentials and generating a JWT.
 *
 * @param {Request} req - Request with username and password in the body.
 * @param {Response} res - Response to send login status or error.
 * @returns {void} - Responds with a JWT token if login succeeds, or an error if login fails.
 */
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Attempt to get the user by username or email
    let user;
    if (!username.includes('@')) {
      user = await userModel.selectUserByUsername(username);
    } else {
      user = await userModel.selectUserByEmail(username);
    }
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    // Check if provided password is correct
    const is_match = await bcrypt.compare(password, user.password_hash);
    if (!is_match) return res.status(401).json({ error: 'Invalid username or password' });

    // Update last login timestamp in database
    await userModel.updateUserLastLogin(user.username);

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, application_secret, {
      expiresIn: application_token_expiration_time,
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
}

/**
 * Handles user logout by clearing the authentication token.
 *
 * @param {Request} req - Request with user session information.
 * @param {Response} res - Response to send logout status.
 * @returns {void} - Responds with a success status upon logout.
 */
const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    // Successful logout response
    res.status(204).send();
  } catch (error) {
    console.error('Error logging out user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Deletes a user account if the request is made by the logged-in user.
 *
 * @param {Request} req - The request object containing the user ID to be deleted.
 * @param {Response} res - The response object used to send a confirmation message or an error.
 * @returns {void} - Sends a response confirming the deletion or an error message.
 */
const deleteUser = async (req, res) => {
  try {
    const { logged_user_id } = req.body;

    // Delete user from database
    await userModel.deleteUser(logged_user_id);

    // Successful response confirming deletion
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Updates the profile information of a logged-in user.
 *
 * @param {Request} req - The request object containing user ID and new profile data.
 * @param {Response} res - The response object used to send the updated user data or an error message.
 * @returns {void} - Sends a response with the updated user information or an error.
 */
const patchUser = async (req, res) => {
  try {
    const { logged_user_id, display_name, gender, birthday, weights, height } = req.body;

    // Serialize weights array into JSON string
    const parsed_weights = JSON.stringify(weights);

    // Update user data in database
    const patched_user = await userModel.updateUser(logged_user_id, display_name, gender, birthday, parsed_weights, height);

    // Remove sensitive data before sending the response
    delete patched_user.password_hash;

    // Successful response with updated user data
    res.status(200).json(patched_user);
  } catch (error) {
    console.error('Error patching user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Uploads or updates the currently logged-in user's avatar.
 *
 * @param {Request} req - Request object containing the user ID and the avatar file.
 * @param {Response} res - Response object to send a success message or error.
 * @returns {void} - Responds with a success message if upload is successful, or an error if it fails.
 */
const patchUserAvatar = async (req, res) => {
  try {
    const { logged_user_id } = req.body;
    const avatar = req.file?.buffer;

    // Check if avatar file is provided
    if (!avatar) {
      return res.status(400).json({ error: 'Avatar file is required' });
    }

    // Resize and crop the image to 128x128
    const avatarBuffer = await resizeAndCropImage(req.file.buffer);

    // Update user avatar in the database
    await userModel.updateUserAvatar(logged_user_id, avatarBuffer);

    // Successful response
    res.status(204).json();
  } catch (error) {
    // Handle Multer file size errors
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds the 512 KB limit' });
    }

    // Handle image dimension errors
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ error: 'Invalid file type. Only JPEG images are allowed.' });
    }

    // Handle image cropping errors
    if (error.message.includes('Input buffer contains unsupported image format')) {
      return res.status(400).json({ error: 'Unsupported image format' });
    }

    // Handle general errors
    console.error('Error uploading avatar:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Updates the currently logged-in user's password.
 *
 * @param {Request} req - Request object with user ID and new password.
 * @param {Response} res - Response object to send a success message or error.
 * @returns {void} - Responds with a success message if update is successful, or an error if it fails.
 */
const patchUserPassword = async (req, res) => {
  try {
    const { logged_user_id, actual_password, new_password } = req.body;

    // Check user existence
    const user = await userModel.selectUserById(logged_user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate provided password against the current user password
    const is_match = await bcrypt.compare(actual_password, user.password_hash);
    if (!is_match) return res.status(400).json({ error: 'Invalid password' });

    // Validate that the new password is not the same as the current password
    if (actual_password === new_password) {
      return res.status(400).json({ error: 'New password cannot be the same as the current password' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(new_password, salt);

    // Update user password in the database
    await userModel.updateUserPassword(logged_user_id, password_hash);

    // Successful response
    res.status(201).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error patching user:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  fetchCurrentLoggedUser,
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  patchUser,
  patchUserAvatar,
  patchUserPassword,
}