require('dotenv').config();
const fs = require('fs');
const yaml = require('js-yaml');
const yargs = require('yargs');

// Parse command-line arguments to locate config file
const argv = yargs
  .option('config', {
    alias: 'c',
    description: 'Path to the YAML configuration file',
    type: 'string',
    default: 'config.yaml',
  })
  .help()
  .argv;

let config;

// Load the configuration keys from YAML file
try {
  const yamlContent = fs.readFileSync(argv.config, 'utf8');

  // Replace placeholders with environment variables
  const interpolatedContent = yamlContent.replace(/%(\w+)%/g, (match, varName) => {
    return process.env[varName] || match; // Use the env variable or keep the placeholder if not found
  });

  config = yaml.load(interpolatedContent);
} catch (error) {
  console.error(`Error loading or parsing ${argv.config}:`, error);
  process.exit(1);
}

// Validate configuration
const requiredKeys = [
  'database.host', 'database.port', 'database.name', 'database.user', 'database.password',
  'application.host', 'application.port', 'application.timezone', 'application.secret', 'application.corsOrigin', 'application.tokenExpirationTime',
  'jobs.closeSkippedWorkoutsEnabled', 'jobs.closeUnfinishedWorkoutsEnabled', 'jobs.closeSkippedWorkoutsCronDefinition', 'jobs.closeUnfinishedWorkoutsCronDefinition',
  'logs.enabled', 'logs.level', 'logs.filePath', 'logs.fileMaxSize', 'logs.fileMaxCount', 'logs.compression',
];

requiredKeys.forEach((key) => {
  const keys = key.split('.');
  let value = config;

  keys.forEach(k => {
    value = value && value[k]; // Traverse the object
  });

  if (value === undefined) {
    console.error(`Missing required config key: ${key}`);
    process.exit(1);
  }
});

// Destructure configuration keys
const {
  database: {
    host: database_host,
    port: database_port,
    name: database_name,
    user: database_user,
    password: database_password,
  },
  application: {
    host: application_host,
    port: application_port,
    timezone: application_timezone,
    secret: application_secret,
    corsOrigin: application_cors_origin,
    tokenExpirationTime: application_token_expiration_time,
  },
  jobs: {
    closeSkippedWorkoutsEnabled: close_skipped_workouts_enabled,
    closeUnfinishedWorkoutsEnabled: close_unfinished_workouts_enabled,
    closeSkippedWorkoutsCronDefinition: close_skipped_workouts_cron_definition,
    closeUnfinishedWorkoutsCronDefinition: close_unfinished_workouts_cron_definition,
  },
  logs: {
    enabled: logs_enabled,
    level: logs_level,
    filePath: logs_file_path,
    fileMaxSize: logs_max_size,
    fileMaxCount: logs_max_files,
    compression: logs_compression,
  }
} = config;

module.exports = {
  database_host,
  database_port,
  database_name,
  database_user,
  database_password,
  application_host,
  application_port,
  application_timezone,
  application_secret,
  application_cors_origin,
  application_token_expiration_time,
  close_skipped_workouts_enabled,
  close_unfinished_workouts_enabled,
  close_skipped_workouts_cron_definition,
  close_unfinished_workouts_cron_definition,
  logs_enabled,
  logs_level,
  logs_file_path,
  logs_max_size,
  logs_max_files,
  logs_compression,
}