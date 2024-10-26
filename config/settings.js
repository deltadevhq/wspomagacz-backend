require('dotenv').config();

// Configuration keys
const applicationHost = process.env.APPLICATION_HOST;
const applicationTimezone = process.env.APPLICATION_TIMEZONE;
const backendPort = process.env.BACKEND_PORT;
const websocketPort = process.env.WEBSOCKET_PORT;
const closeSkippedWorkoutsJobCronDefinition = process.env.CLOSE_SKIPPED_WORKOUTS_JOB_CRON_DEFINITION;
const closeUnfinishedWorkoutsJobCronDefinition = process.env.CLOSE_UNFINISHED_WORKOUTS_JOB_CRON_DEFINITION;
module.exports = {
  applicationHost,
  applicationTimezone,
  backendPort,
  websocketPort,
  closeSkippedWorkoutsJobCronDefinition,
  closeUnfinishedWorkoutsJobCronDefinition
}