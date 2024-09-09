const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = process.env.API_SECRET;

// Verify JWT token
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

// Login to get JWT token cookie
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  // TODO: CONSIDER USER LOGIN BY EMAIL

  try {
    if (username && password) {
      const user = await authModel.getUserCredentials(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      await authModel.updateLastLogin(username);

      const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
        expiresIn: '7d', // TODO: DETERMINE TOKEN EXPIRE TIME / CONSIDER AUTOMATIC TOKEN RENEWAL
      });

      // Set the cookie with the token
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
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

module.exports = {
  loginUser,
  verifyToken,
  logoutUser
};