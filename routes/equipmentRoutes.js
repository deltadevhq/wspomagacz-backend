const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const authController = require('../controllers/authController');
const equipmentSchema = require('../schemas/equipmentSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', authController.verifyToken, equipmentController.getEquipment);
router.get('/:id', validateInput(equipmentSchema.getEquipmentSchema, 'params'), authController.verifyToken, equipmentController.getEquipmentById);

module.exports = router;