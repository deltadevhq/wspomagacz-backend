const express = require('express');
const app = express();
const pool = require('./database');

const port = 3000;
const listener = 'localhost';

app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// GET route to fetch all users
app.get('/api/users', (req, res) => {
  // TODO: Get from Database
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' }
  ];
  res.json(users);
});

// Example POST route to create users
app.post('/api/users', (req, res) => {
  const newUser = req.body;
  // TODO: Post to Database
  res.status(201).json(newUser);
});

// Start the server
app.listen(port, () => {
  console.log(`API listening at http://${listener}:${port}`);
});