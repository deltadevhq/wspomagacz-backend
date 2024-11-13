// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');
const { sse_connections } = require('../config/sse');
const notificationModel = require('../models/notificationModel');

/**
 * Handles requests to fetch notifications for a specific user.
 *
 * @param {Request} req - The request object containing the logged user's ID in the body.
 * @param {Response} res - The response object to return the notifications or an error message.
 * @returns {void} - Responds with the notifications data on success or an error message if the fetch fails.
 */
const fetchNotifications = async (req, res) => {
  try {
    const { logged_user_id } = req.body;
    const { offset, limit } = req.query;

    const notifications = await notificationModel.selectNotifications(logged_user_id, offset, limit);
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handles requests to fetch a specific notification by its ID.
 *
 * @param {Request} req - The request object containing the notification ID as a route parameter.
 * @param {Response} res - The response object to return the notification data or an error message.
 * @returns {void} - Responds with the notification data on success or an error message if the fetch fails.
 */
const fetchNotificationById = async (req, res) => {
  try {
    const { id: notification_id } = req.params;

    const notification = await notificationModel.selectNotificationById(notification_id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    res.status(200).json(notification);
  } catch (error) {
    console.error('Error fetching notification by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Opens a Server-Sent Events (SSE) stream for sending real-time notification updates to the client.
 *
 * @param {Request} req - The request object containing the logged user ID in the request body.
 * @param {Response} res - The response object used to send the SSE headers and notifications.
 * @returns {void} - Sets headers for SSE and maintains the connection for sending notifications.
 */
const openNotificationEventsStream = async (req, res) => {
  try {
    const { logged_user_id } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    req.on('close', () => {
      console.log('SSE connection closed');
      sse_connections.delete(logged_user_id);
      res.end();
    });

    sse_connections.set(logged_user_id, res);
  } catch (error) {
    console.error('Error fetching notification stream:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Marks all notifications for the logged-in user as read.
 *
 * @param {Request} req - The request object containing the logged user ID in the request body.
 * @param {Response} res - The response object used to send the success or error message.
 * @returns {void} - Sends a response indicating success or failure of the operation.
 */
const postMarkAllAsRead = async (req, res) => {
  try {
    const { logged_user_id } = req.body;

    const result = await notificationModel.updateMarkAllAsRead(logged_user_id);
    if (!result) return res.status(404).json({ error: 'Notification not found' });

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Marks a specific notification as read based on its ID.
 *
 * @param {Request} req - The request object containing the notification ID in the parameters.
 * @param {Response} res - The response object used to send the success or error message.
 * @returns {void} - Sends a response indicating success or failure of the operation.
 */
const postMarkAsReadById = async (req, res) => {
  try {
    const { id: notification_id } = req.params;

    const result = await notificationModel.updateMarkAsReadById(notification_id);
    if (!result) return res.status(404).json({ error: 'Notification not found' });

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  fetchNotifications,
  fetchNotificationById,
  fetchNotificationEvents: openNotificationEventsStream,
  postMarkAllAsRead,
  postMarkAsReadById,
}