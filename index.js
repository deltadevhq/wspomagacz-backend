require('dotenv').config();
const express = require('express');
const { initDBConnection } = require('./config/database');
const cors = require('cors');
const morgan = require('morgan');
const moment = require('moment-timezone');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const cron = require('node-cron');
const app = express();
const routes = require('./routes');
const { port, listener, timezone, swaggerDocs, packageJson } = require('./config/settings');
const jobs = require('./utilities/jobs');

// Function to generate a timestamp in timezone from configuration
const getTimestamp = () => {
  return moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
};

// Override console.log to include a timestamp
const baseConsoleLog = console.log;
console.log = function (...args) {
  baseConsoleLog(`[INFO][${getTimestamp()}]`, ...args);
};

// Override console.error to include a timestamp
const baseConsoleError = console.error;
console.error = function (...args) {
  baseConsoleError(`[ERROR][${getTimestamp()}]`, ...args);
};

// Define a custom token for the date in timezone from configuration
morgan.token('date', () => {
  return getTimestamp();
});

// Use morgan to log requests to the console
app.use(morgan('[INFO][:date] Request: :method :url HTTP/:http-version, Response: :status, ResponseTime: :response-time ms'));

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
app.use('/api/auth', routes.authRoutes);
app.use('/api/users', routes.userRoutes);
app.use('/api/muscles', routes.muscleRoutes);
app.use('/api/equipment', routes.equipmentRoutes);
app.use('/api/exercises', routes.exerciseRoutes);
app.use('/api/workouts', routes.workoutRoutes);
app.use('/api/experience', routes.experienceRoutes);


// Main execution flow
(async () => {
  try {
    console.log(`Starting ${packageJson.name} version ${packageJson.version}`);

    await initDBConnection();

    const server = app.listen(port, () => {
      console.log(`API listening at http://${listener}:${port}`);
    });

    server.on('listening', () => {
      console.log('Server initlaization completed.');

      // Schedule daily jobs
      cron.schedule('0 0 * * *', () => {
        jobs.closeSkippedWorkouts();
        jobs.closeUnfinishedWorkouts();
      });

      require('./utilities/workoutGenerator');

    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
})();

// TODO: VERIFY MUSCLE EXISTENCE
// TODO: VERIFY EQUIPMENT EXISTENCE
// TODO: VERIFY EXERCISE EXISTIENCE
// TODO: VERIFY EXERCISE - EQUIPMENT/MUSCLE OWNERSHIP
// CONSIDER: VERIFY WORKOUT - EXERCISE OWNERSHIP
// CONSIDER: EVENTS FOR SPECIFIC EXERCISES / MUSCLES GROUPS

// ENDPOINT: GET /API/USERS/{ID}/NOTIFICATIONS - FETCH ALL NOTIFICATIONS FOR USER
// ENDPOINT: GET /API/USERS/{ID}/NOTIFICATIONS/READ - READ ALL NOTIFICATION FOR USER
// CONSIDER: GET /API/USERS/{ID}/NOTIFICATIONS/{NOTIFICATION_ID}/READ - READ SINGLE NOTIFICATION FOR USER

// TODO: EMIT NOTIFICATION FOR AUTOMATICLY CLOSED WORKOUT BY JOB
// TODO: EMIT NOTIFICATION FOR USER LEVEL UP
// TODO: EMIT NOTIFICATION FOR FRIEND REQUEST
// TODO: WEBSOCKET FOR NOTIFICATIONS

// CONSIDER: DETERMINE TOKEN EXPIRE TIME / CONSIDER AUTOMATIC TOKEN RENEWAL
// CONSIDER: OPERATIONS_TO_EXECUTE TABLE IN DATABASE FOR OPERTAIONS LIKE USER DELETION
// CONSIDER: LIMIT RATE ENDPOINTS - DDS PROTECTION
// OPTIONAL: USER LOGIN BY EMAIL
// OPTIONAL: PASSWORD CHANGE ENDPOINT
// OPTIONAL: REDIS FOR CACHE DATA

// TODO: ŚLAD WĘGLOWY WORKOUTU