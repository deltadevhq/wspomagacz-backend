require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const app = express();
const { authRoutes, userRoutes, muscleRoutes, equipmentRoutes, exerciseRoutes, workoutRoutes } = require('./routes');
const { port, listener, swaggerDocs } = require('./config/settings')

// Use morgan to log requests to the console
app.use(morgan('[:date[clf]] Request: :method :url HTTP/:http-version, Response: :status, ResponseTime: :response-time ms'));
// Use cookieparser to parse cookies
app.use(cookieParser());
// Use CORS to control allow origin access
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());

// Define specific routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/muscles', muscleRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);

// Start the server
app.listen(port, () => {
  console.log(`API listening at http://${listener}:${port}`);
});

// TODO: VALIDATE PARAMS DATA
// TODO: VALIDATE BODY DATA
// TODO: LIMIT RATE LOGIN ENDPOINT
// TODO: VERIFY IF EVERY POST/PATCH ENDPOINT RETURNS HTTP 400 ON LACK OF REQUIRED DATA
// TODO: VERIFY IF ALL RESPONSES FOR 5xx AND 4xx ARE VALID
// TODO: CHECK IF RETURNS ARE NECESSARY IN EVERY FILE