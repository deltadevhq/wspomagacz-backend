const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = process.env.API_SECRET;

// Verify JWT token
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
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

        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
            expiresIn: '7d', // TODO: DETERMINE TOKEN EXPIRE TIME / CONSIDER AUTOMATIC TOKEN RENEWAL
        });
        
        res.status(201).json({ token });
    } else {
      return res.status(400).json({ error: 'Invalid login request' });
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  loginUser,
  verifyToken
};