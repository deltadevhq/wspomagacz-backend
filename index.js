const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const pool = require('./config/database');

const port = 3000;
const listener = 'localhost';

app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use user routes
app.use('/api', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`API listening at http://${listener}:${port}`);
});