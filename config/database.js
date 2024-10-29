const { databaseHost, databasePort, databaseName, databaseUser, databasePassword } = require('./settings');
const { Pool } = require('pg');

const pool = new Pool({
  host: databaseHost,
  port: databasePort,
  database: databaseName,
  user: databaseUser,
  password: databasePassword,
  ssl: { rejectUnauthorized: false }
});

// Initialize connection and return a Promise
const initDBConnection = () => {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, release) => {
      if (err) {
        console.error('Error acquiring database client', err.stack);
        return reject(err);
      }
      client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
          console.error('Error executing query', err.stack);
          return reject(err);
        }
        console.log(`Database connection successful!`);
        resolve(result);
      });
    });
  });
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