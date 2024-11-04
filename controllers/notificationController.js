// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');

const notificationModel = require('../models/notificationModel');
const { sse_connections } = require('../config/sse');

/**
 * Fetch all notifications for the logged-in user
 * @param {Request} req
 * @param {Response} res
 */
const fetchNotifications = async (req, res) => {
  try {
    const { logged_user_id } = req.body;

    const notifications = await notificationModel.selectNotifications(logged_user_id);

    if (!notifications) return res.status(404).json({ error: 'Notifications not found' });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Fetch a notification by its ID
 * @param {Request} req
 * @param {Response} res
 */
const fetchNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await notificationModel.selectNotificationById(id);

    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    res.status(200).json(notification);
  } catch (error) {
    console.error('Error fetching notification by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Open a stream to listen for notification events
 * @param {Request} req
 * @param {Response} res
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
};

/**
 * Mark all notifications as read for the logged-in user
 * @param {Request} req
 * @param {Response} res
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
};

/**
 * Mark a notification as read by its ID
 * @param {Request} req
 * @param {Response} res
 */
const postMarkAsReadById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await notificationModel.updateMarkAsReadById(id);

    if (!result) return res.status(404).json({ error: 'Notification not found' });

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  fetchNotifications,
  fetchNotificationById,
  fetchNotificationEvents: openNotificationEventsStream,
  postMarkAllAsRead,
  postMarkAsReadById,
};
