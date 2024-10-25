const WebSocket = require('ws');
const { pool } = require('./database');
const { applicationHost, websocketPort } = require('./settings');

pool.query('LISTEN new_notification');

const notificationWebsocket = new WebSocket.Server({ port: websocketPort });

notificationWebsocket.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

pool.on('notification', async (msg) => {
  const notificationId = msg.payload;
  const notificationQuery = 'SELECT * FROM notifications WHERE id = $1';
  const { rows } = await dbClient.query(notificationQuery, [notificationId]);
  const notification = rows[0];

  if (notification) {
    // Broadcast notification to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(notification));
      }
    });
    console.log(notification);
  }
});

console.log(`WebSocket server is running on ws://${applicationHost}:${websocketPort}`);

module.exports = {
  notificationWebsocket,
};