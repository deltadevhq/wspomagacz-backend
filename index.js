require('dotenv').config();
require('./setup')
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const cron = require('node-cron');
const swaggerUi = require('swagger-ui-express');
const { initDBConnection } = require('./config/database');
const { applicationHost, backendPort, closeSkippedWorkoutsJobCronDefinition, closeUnfinishedWorkoutsJobCronDefinition } = require('./config/settings');
const { swaggerDocs, packageJson } = require('./setup');
const jobs = require('./utilities/jobs');
const routes = require('./routes');

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

    const server = app.listen(backendPort, () => {
      console.log(`API listening at http://${applicationHost}:${backendPort}`);
    });

    require('./config/websocket');

    // Schedule daily jobs
    cron.schedule(closeSkippedWorkoutsJobCronDefinition, () => {
      jobs.closeSkippedWorkouts();
    });
    console.log(`Scheduled 'closeSkippedWorkoutsJob' with cron expression: '${closeSkippedWorkoutsJobCronDefinition}'`);

    cron.schedule(closeUnfinishedWorkoutsJobCronDefinition, () => {
      jobs.closeUnfinishedWorkouts();
    });
    console.log(`Scheduled 'closeUnfinishedWorkoutsJob' with cron expression: '${closeUnfinishedWorkoutsJobCronDefinition}'`);

    server.on('listening', () => {
      console.log('Server initlaization completed.');



    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
})();

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
// OPTIONAL: SMTP MAILER IMPLEMENTATION FOR THINGS LIKE REGISTER EMAIL
// OPTIONAL: PASSWORD CHANGE ENDPOINT
// OPTIONAL: REDIS FOR CACHE DATA

// TODO: ŚLAD WĘGLOWY WORKOUTU