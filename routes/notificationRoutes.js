const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const notificationSchema = require('../schemas/notificationSchema');
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

router.get('/', verifyToken, notificationController.getNotifications);
router.get('/events', verifyToken, notificationController.getNotificationEvents);
router.post('/mark-as-read', validateInput(notificationSchema.postMarkAllAsReadSchema, 'body'), verifyToken, notificationController.postMarkAsRead);
router.get('/:id', validateInput(notificationSchema.getNotificationByIdSchema, 'params'), verifyToken, notificationController.getNotificationById);
router.post('/:id/mark-as-read', validateInput(notificationSchema.postMarkAsReadByIdSchema, 'params'), verifyToken, notificationController.postMarkAsReadById);

module.exports = router;
