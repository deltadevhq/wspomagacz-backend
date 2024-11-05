const {
  database_host,
  database_port,
  database_name,
  database_user,
  database_password,
  application_timezone,
} = require('./settings');
const { Pool } = require('pg');

const pool = new Pool({
  host: database_host,
  port: database_port,
  database: database_name,
  user: database_user,
  password: database_password,
  ssl: { rejectUnauthorized: false },
});

// Initialize connection and return a Promise
const initializeDatabaseConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log(`Database connection successful!`);

    const timezone_result = await pool.query('SHOW TIMEZONE');
    const { TimeZone: timezone } = timezone_result.rows[0];

    if (timezone !== application_timezone) {
      console.error(`Database timezone (${timezone}) is not equal to timezone from configuration (${application_timezone}).`);
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
  initializeDatabaseConnection,
  pool,
};
