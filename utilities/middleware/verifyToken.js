// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');
const { applicationSecret } = require('../../config/settings');
const jwt = require('jsonwebtoken');

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
  verifyToken,
};