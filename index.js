require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const cron = require('node-cron');
const app = express();
const routes = require('./routes');
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
app.use('/api/auth', routes.authRoutes);
app.use('/api/users', routes.userRoutes);
app.use('/api/muscles', routes.muscleRoutes);
app.use('/api/equipment', routes.equipmentRoutes);
app.use('/api/exercises', routes.exerciseRoutes);
app.use('/api/workouts', routes.workoutRoutes);
app.use('/api/levels', routes.levelRoutes);

// Start the server
app.listen(port, () => {
    console.log(`API listening at http://${listener}:${port}`);
});

// Daily jobs definition
cron.schedule('0 0 * * *', () => {
    jobs.closeSkippedWorkouts();
    jobs.closeUnfinishedWorkouts();
});

// TODO: ADD UNITED TIMESTAMP FOR EVERY LOG

// ENDPOINT: GET /API/LEVELS/LEVEL-BY-XP
// ENDPOINT: GET /API/LEVELS/XP-BY-LEVEL
// TODO: CREATE MEANWHILE FUNCTION FOR XP POINTS

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

// TODO: ŚLAD WĘGLOWY WORKOUTU