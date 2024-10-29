const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const authController = require('../controllers/authController');
const equipmentSchema = require('../schemas/equipmentSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', authController.verifyToken, equipmentController.getEquipment);
router.get('/:id', authController.verifyToken, validateInput(equipmentSchema.getEquipmentSchema, 'params'), equipmentController.getEquipmentById);

module.exports = router;