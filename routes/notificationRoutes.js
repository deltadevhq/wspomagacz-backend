const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const notificationSchema = require('../schemas/notificationSchema');
const { verifyToken } = require('../utilities/middleware/verifyToken');
const { validateInput } = require('../utilities/middleware/validateInput');

router.get('/', validateInput(notificationSchema.fetchNotificationsSchema, 'query'), verifyToken, notificationController.fetchNotifications);
router.get('/events', verifyToken, notificationController.fetchNotificationEvents);
router.get('/:id', validateInput(notificationSchema.fetchNotificationByIdSchema, 'params'), verifyToken, notificationController.fetchNotificationById);
router.post('/mark-as-read', verifyToken, notificationController.postMarkAllAsRead);
router.post('/:id/mark-as-read', validateInput(notificationSchema.postMarkAsReadByIdSchema, 'params'), verifyToken, notificationController.postMarkAsReadById);

module.exports = router;
