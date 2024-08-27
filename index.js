const express = require('express');
const morgan = require('morgan');
const app = express();
const { userRoutes, authRoutes } = require('./routes');

const port = 3000;
const listener = 'localhost';

app.use(express.json());

// Use morgan to log requests to the console
app.use(morgan('[:date[clf]] Request: :method :url HTTP/:http-version, Response: :status, ResponseTime: :response-time ms'));

// Use user routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`API listening at http://${listener}:${port}`);
});


// TODO: IMPORTANT!! CREATE A FUNCTION TO OMIT IDOR VULNERABILITY