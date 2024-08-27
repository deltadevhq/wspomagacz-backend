const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = process.env.API_SECRET; // TODO: GENERATE SECRET AND KEY

// Verify JWT token
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], secretKey);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Login to get JWT
const login = async (req, res) => {
  const username = req.params.username;
  const password = req.params.password;

  try {
    if (username && password) {
        const user = await authModel.getUser(username);

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
            expiresIn: '1h', // TODO: DETERMINE TOKEN EXPIRE TIME
        });
        
        res.json({ token });

    } else {
      return res.status(400).json({ error: 'Invalid login request' });
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Register new user
const register = async (req, res) => {
  // TODO: CREATE REGISTER CONTROLLER
};

module.exports = {
  login,
  verifyToken,
  register,
};