const WebSocket = require('ws');
const { applicationHost, websocketPort } = require('../config/settings');

// Replace with your WebSocket server's URL
const socket = new WebSocket(`ws://${applicationHost}:${websocketPort}`);

// Event listener for when the WebSocket connection opens
socket.on('open', () => {
    console.log('Connected to WebSocket server');
});

// Event listener for receiving messages
socket.on('message', (data) => {
    console.log('New notification received:', data);
});

// Event listener for when the WebSocket connection closes
socket.on('close', () => {
    console.log('Disconnected from WebSocket server');
});

// Event listener for errors
socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});