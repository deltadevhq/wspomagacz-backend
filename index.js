require('./setup');
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const cron = require('node-cron');
const swaggerUi = require('swagger-ui-express');
const jobs = require('./utilities/jobs');
const routes = require('./routes');
const config = require('./config/settings');
const { initializeDatabaseConnection } = require('./config/database');
const { swaggerDocs, packageJson } = require('./setup');
const { dateFormatter } = require('./utilities/middleware/dateFormatter');

// Use morgan to log requests to the console
const morganFormat = 'Request: :method :url HTTP/:http-version, Response: :status, ResponseTime: :response-time ms'
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      console.log(message.trim());
    }
  }
}));

// Use cookieParser to parse cookies
app.use(cookieParser());

// Use compression to compress responses
app.use(compression());

// Use CORS to control allow origin access
app.use(cors({
  origin: config.application_cors_origin,
  credentials: true,
}));
app.use(express.json());

// Define specific routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/achievements', dateFormatter, routes.achievementRoutes);
app.use('/api/activities', dateFormatter, routes.activitiesRoutes);
app.use('/api/auth', dateFormatter, routes.authRoutes);
app.use('/api/equipment', dateFormatter, routes.equipmentRoutes);
app.use('/api/exercises', dateFormatter, routes.exerciseRoutes);
app.use('/api/experience', dateFormatter, routes.experienceRoutes);
app.use('/api/friends', dateFormatter, routes.friendsRoutes);
app.use('/api/muscles', dateFormatter, routes.muscleRoutes);
app.use('/api/notifications', dateFormatter, routes.notificationRoutes);
app.use('/api/users', dateFormatter, routes.userRoutes);
app.use('/api/workouts', dateFormatter, routes.workoutRoutes);


// Main execution flow
(async () => {
  try {
    console.log(`Starting ${packageJson.name} version ${packageJson.version}`);
    console.log(`Application timezone: ${config.application_timezone}`);

    await initializeDatabaseConnection();

    const server = app.listen(config.application_port, () => {
      console.log(`API listening at http://${config.application_host}:${config.application_port}`);
    });

    // Schedule jobs if enabled
    if (config.close_skipped_workouts_enabled === true) {
      cron.schedule(config.close_skipped_workouts_cron_definition, () => {
        jobs.closeSkippedWorkouts();
      }, { timezone: config.application_timezone });

      console.log(`Scheduled 'closeSkippedWorkoutsJob' with cron expression: '${config.close_skipped_workouts_cron_definition}'`);
    }

    if (config.close_unfinished_workouts_enabled === true) {
      cron.schedule(config.close_unfinished_workouts_cron_definition, () => {
        jobs.closeUnfinishedWorkouts();
      }, { timezone: config.application_timezone });

      console.log(`Scheduled 'closeUnfinishedWorkoutsJob' with cron expression: '${config.close_unfinished_workouts_cron_definition}'`);
    }

    server.on('listening', () => {
      console.log('Server initialization completed.');


    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
})();

// TODO: IMPLEMENT FRIENDS ACHIEVEMENT SYSTEM
// TODO: RETURN ACHIEVEMENT_PROGRESS FOR LEVEL_UP ACHIEVEMENT

// OPTIONAL: EMIT NOTIFICATION ON LIKE, REMOVE IT ON UNLIKE AND MAKE ENDPOINT TO SHOW WHO LIKED CERTAIN ACTIVITY
// OPTIONAL: NOTIFICATION ON EVENT START OR CAROUSEL
// OPTIONAL: IMPLEMENT WORKOUT STREAKS
// OPTIONAL: EVENTS FOR SPECIFIC EXERCISES / MUSCLES GROUPS

// CONSIDER: DETERMINE TOKEN EXPIRE TIME / CONSIDER AUTOMATIC TOKEN RENEWAL
// CONSIDER: OPERATIONS_TO_EXECUTE TABLE IN DATABASE FOR OPERATIONS LIKE USER DELETION
// CONSIDER: LIMIT RATE ENDPOINTS - DDS PROTECTION

// OPTIONAL: [QUALITY] DEBUG LOGGING LEVEL
// OPTIONAL: [QUALITY] JOB MANAGER
// OPTIONAL: [QUALITY] SMTP MAILER IMPLEMENTATION
// OPTIONAL: [QUALITY] REDIS FOR CACHE DATA
// OPTIONAL: [QUALITY] DATABASE UPGRADE SYSTEM
// OPTIONAL: [QUALITY] CHECK WHY ERRORS LOG TWO TIMES
// OPTIONAL: [QUALITY] BETTER LOGS FOR SSE CONNECTIONS