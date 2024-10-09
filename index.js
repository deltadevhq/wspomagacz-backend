require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const cron = require('node-cron');
const app = express();
const { authRoutes, userRoutes, muscleRoutes, equipmentRoutes, exerciseRoutes, workoutRoutes } = require('./routes');
const { port, listener, swaggerDocs } = require('./config/settings');
const jobs = require('./utilities/jobs');

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

// Daily jobs definition
cron.schedule('0 0 * * *', () => {
  jobs.closeSkippedWorkouts();
  jobs.closeUnfinishedWorkouts();
});

// TODO: VALIDATE PARAMS DATA
// TODO: VALIDATE BODY DATA
// TODO: LIMIT RATE LOGIN ENDPOINT
// TODO: ADD TIMESTAMP FOR EVERY LOG
// TODO: CREATE EXTENDED COMMENTS FOR EVERY FUNCTION

// ENDPOINT: /LEVEL/FOR-XP DO SPRAWDZANIA ILE POTRZEBA EXPA DO KONKRETNEGO POZIOMU Z PARAMETREM ?LVL=3
// TODO: WYMYŚLIC TYMCZASOWĄ FUNKCJE DO POZIOMÓW DOŚWIADCZENIA

// ENDPOINT: FETCH ALL NOTIFICATIONS FOR USER
// ENDPOINT: READ ALL NOTIFICATIONS FOR USER
// TODO: EMIT NOTIFICATION FOR AUTOMATICLY CLOSED WORKOUT BY JOB
// TODO: EMIT NOTIFICATION FOR LVL UP
// TODO: EMIT NOTIFICATION FOR FRIEND REQUEST
// TODO: WEBSOCKET FOR NOTIFICATIONS

// TODO: ŚLAD WĘGLOWY WORKOUTU