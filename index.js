const express = require('express');
const morgan = require('morgan');
const app = express();
const userRoutes = require('./routes/userRoutes');
const pool = require('./config/database');

const port = 3000;
const listener = 'localhost';

app.use(express.json());

// Use morgan to log requests to the console
app.use(morgan('[:date[clf]] Request: :method :url HTTP/:http-version, Response: :status, ResponseTime: :response-time ms'));

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