const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authController = require('../controllers/authController');
const notificationSchema = require('../schemas/notificationSchema');
const { validateInput } = require('../utilities/validation');

router.get('/', authController.verifyToken, notificationController.getNotifications);
router.get('/events', authController.verifyToken, notificationController.getNotificationEvents);
router.post('/mark-as-read', validateInput(notificationSchema.postMarkAllAsReadSchema, 'body'), authController.verifyToken, notificationController.postMarkAsRead);
router.get('/:id', validateInput(notificationSchema.getNotificationByIdSchema, 'params'), authController.verifyToken, notificationController.getNotificationById);
router.post('/:id/mark-as-read', validateInput(notificationSchema.postMarkAsReadByIdSchema, 'params'), authController.verifyToken, notificationController.postMarkAsReadById);

module.exports = router;
