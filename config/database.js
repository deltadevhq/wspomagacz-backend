const {
  databaseHost,
  databasePort,
  databaseName,
  databaseUser,
  databasePassword,
  applicationTimezone,
} = require('./settings');
const { Pool } = require('pg');

const pool = new Pool({
  host: databaseHost,
  port: databasePort,
  database: databaseName,
  user: databaseUser,
  password: databasePassword,
  ssl: { rejectUnauthorized: false },
});

// Initialize connection and return a Promise
const initDBConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log(`Database connection successful!`);

    const timezoneResult = await pool.query('SHOW TIMEZONE');
    const { TimeZone } = timezoneResult.rows[0];

    if (TimeZone !== applicationTimezone) {
      console.error(`Database timezone (${TimeZone}) is not equal to timezone from configuration (${applicationTimezone}).`);
      process.exit(-1);
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

pool.on('error', (err) => {
  console.error('Unexpected error on database idle client', err);
  process.exit(-1);
});

// Export the pool and the init function
module.exports = {
  initDBConnection,
  pool,
};
