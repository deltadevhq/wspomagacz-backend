require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
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