require('./setup')
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const cron = require('node-cron');
const swaggerUi = require('swagger-ui-express');
const jobs = require('./utilities/jobs');
const routes = require('./routes');
const { applicationHost, backendPort, closeSkippedWorkoutsJobCronDefinition, closeUnfinishedWorkoutsJobCronDefinition, applicationCorsOrigin, applicationTimezone } = require('./config/settings');
const { initDBConnection } = require('./config/database');
const { swaggerDocs, packageJson } = require('./setup');
const { dateFormatterMiddleware } = require('./utilities/dateFormatter');

// Use morgan to log requests to the console
app.use(morgan('[INFO][:date] Request: :method :url HTTP/:http-version, Response: :status, ResponseTime: :response-time ms'));

// Use cookieParser to parse cookies
app.use(cookieParser());

// Use CORS to control allow origin access
app.use(cors({
  origin: applicationCorsOrigin,
  credentials: true
}));
app.use(express.json());

// Define specific routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/auth', dateFormatterMiddleware, routes.authRoutes);
app.use('/api/users', dateFormatterMiddleware, routes.userRoutes);
app.use('/api/muscles', dateFormatterMiddleware, routes.muscleRoutes);
app.use('/api/equipment', dateFormatterMiddleware, routes.equipmentRoutes);
app.use('/api/exercises', dateFormatterMiddleware, routes.exerciseRoutes);
app.use('/api/workouts', dateFormatterMiddleware, routes.workoutRoutes);
app.use('/api/experience', dateFormatterMiddleware, routes.experienceRoutes);
app.use('/api/friends', dateFormatterMiddleware, routes.friendsRoutes);


// Main execution flow
(async () => {
  try {
    console.log(`Starting ${packageJson.name} version ${packageJson.version}`);
    console.log(`Application timezone: ${applicationTimezone}`);

    await initDBConnection();

    const server = app.listen(backendPort, () => {
      console.log(`API listening at http://${applicationHost}:${backendPort}`);
    });

    // require('./config/websocket');

    // Schedule daily jobs
    cron.schedule(closeSkippedWorkoutsJobCronDefinition, () => {
      jobs.closeSkippedWorkouts();
    }, { timezone: applicationTimezone });
    console.log(`Scheduled 'closeSkippedWorkoutsJob' with cron expression: '${closeSkippedWorkoutsJobCronDefinition}'`);

    cron.schedule(closeUnfinishedWorkoutsJobCronDefinition, () => {
      jobs.closeUnfinishedWorkouts();
    }, { timezone: applicationTimezone });
    console.log(`Scheduled 'closeUnfinishedWorkoutsJob' with cron expression: '${closeUnfinishedWorkoutsJobCronDefinition}'`);

    server.on('listening', () => {
      console.log('Server initialization completed.');



    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
})();

// TODO: WORKOUT STREAK
// CONSIDER: EVENTS FOR SPECIFIC EXERCISES / MUSCLES GROUPS

// TODO: STANDARDIZE ALL VARIABLE AND FUNCTION NAMES
// TODO: STANDARDIZE ID IN EVERY SCHEMA TO USE REQUEST SCHEMA
// TODO: CHECK IF EVERY RES.STATUS HAVE RETURN

// ENDPOINT: GET /API/USERS/{ID}/NOTIFICATIONS - FETCH ALL NOTIFICATIONS FOR USER
// ENDPOINT: GET /API/USERS/{ID}/NOTIFICATIONS/READ - READ ALL NOTIFICATION FOR USER
// ENDPOINT: GET /API/USERS/{ID}/NOTIFICATIONS/{NOTIFICATION_ID}/READ - READ SINGLE NOTIFICATION FOR USER
// TODO: EMIT NOTIFICATION FOR AUTOMATICALLY CLOSED WORKOUT BY JOB
// TODO: EMIT NOTIFICATION FOR USER LEVEL UP
// TODO: EMIT NOTIFICATION FOR FRIEND REQUEST
// TODO: WEBSOCKET FOR NOTIFICATIONS

// CONSIDER: DETERMINE TOKEN EXPIRE TIME / CONSIDER AUTOMATIC TOKEN RENEWAL
// CONSIDER: OPERATIONS_TO_EXECUTE TABLE IN DATABASE FOR OPERATIONS LIKE USER DELETION
// CONSIDER: LIMIT RATE ENDPOINTS - DDS PROTECTION

// OPTIONAL: [QUALITY] LOG TO FILE
// OPTIONAL: [QUALITY] JOB MANAGER
// OPTIONAL: [QUALITY] SMTP MAILER IMPLEMENTATION
// OPTIONAL: [QUALITY] REDIS FOR CACHE DATA
// OPTIONAL: [QUALITY] DEBUG LOGGING LEVEL
// OPTIONAL: [QUALITY] DATABASE UPGRADE SYSTEM