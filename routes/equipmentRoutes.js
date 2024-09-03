const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const authController = require('../controllers/authController');

// AUTH ROUTES
router.get('/', authController.verifyToken, equipmentController.getEquipment);
router.get('/:id', authController.verifyToken, equipmentController.getEquipmentById);


module.exports = router;
