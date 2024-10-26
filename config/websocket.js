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
  try {
    console.log(msg);
    const notificationId = msg.payload.id;
    const notificationQuery = 'SELECT * FROM notifications WHERE id = $1';
    const { rows } = await pool.query(notificationQuery, [notificationId]);
    const notification = rows[0];

    if (notification) {
      // Broadcast notification to all connected clients
      notificationWebsocket.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(notification));
        }
      });
      console.log('Notification sent to clients:', notification);
    }
  } catch (error) {
    console.error('Error handling notification:', error);
  }
});

console.log(`WebSocket server is running on ws://${applicationHost}:${websocketPort}`);

module.exports = {
  notificationWebsocket,
};