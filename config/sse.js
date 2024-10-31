const { Client } = require('pg');
const { databaseHost, databasePort, databaseName, databaseUser, databasePassword } = require('../config/settings');

const sse_connections = new Map();

const client = new Client({
  host: databaseHost,
  port: databasePort,
  database: databaseName,
  user: databaseUser,
  password: databasePassword,
  ssl: { rejectUnauthorized: false },
});

client.connect();
client.query('LISTEN notifications');

client.on('error', (error) => {
  console.error('Error in PostgreSQL client:', error);
});

client.on('notification', (data) => {
  const payload = JSON.parse(data?.payload);
  const { user_id } = payload;

  if (sse_connections.has(user_id)) {
    console.log('Sending notification:', data?.payload);

    const res = sse_connections.get(user_id);

    res.write(`event: message\ndata: ${JSON.stringify(data?.payload)}\n\n\n`);
    res.flush();
  }
});

module.exports = {
  sse_connections,
};
