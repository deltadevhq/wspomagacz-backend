const { Server } = require('ws');
const {
  applicationHost,
  websocketPort,
  databaseHost,
  databasePort,
  databaseName,
  databaseUser,
  databasePassword,
} = require('./settings');
const { Client } = require('pg');

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

const notificationWebsocket = new Server({ port: websocketPort });

notificationWebsocket.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

client.on('notification', async (data) => {
  console.log('Received notification:', data);

  try {
    if (data.payload) {
      // Broadcast notification to all connected clients
      notificationWebsocket.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data.payload));
        }
      });
    }
  } catch (error) {
    console.error('Error handling notification:', error);
  }
});

console.log(`WebSocket server is running on ws://${applicationHost}:${websocketPort}`);

module.exports = {
  notificationWebsocket,
};
