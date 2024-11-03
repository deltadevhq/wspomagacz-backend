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
  'application.host', 'application.timezone', 'application.secret', 'application.corsOrigin','application.tokenExpirationTime',
  'backend.port', 'websocket.port',
  'cronJobs.closeSkippedWorkouts', 'cronJobs.closeUnfinishedWorkouts'
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
  database: { host: databaseHost, port: databasePort, name: databaseName, user: databaseUser, password: databasePassword },
  application: { host: applicationHost, timezone: applicationTimezone, secret: applicationSecret, corsOrigin: applicationCorsOrigin, tokenExpirationTime: applicationTokenExpirationTime  },
  backend: { port: backendPort },
  websocket: { port: websocketPort },
  cronJobs: { closeSkippedWorkouts: closeSkippedWorkoutsJobCronDefinition, closeUnfinishedWorkouts: closeUnfinishedWorkoutsJobCronDefinition },
} = config;

module.exports = {
  databaseHost,
  databasePort,
  databaseName,
  databaseUser,
  databasePassword,
  applicationHost,
  applicationTimezone,
  applicationSecret,
  applicationCorsOrigin,
  applicationTokenExpirationTime,
  backendPort,
  websocketPort,
  closeSkippedWorkoutsJobCronDefinition,
  closeUnfinishedWorkoutsJobCronDefinition,
}