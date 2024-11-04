const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const equipmentSchema = require('../schemas/equipmentSchema');
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', verifyToken, equipmentController.fetchEquipment);
router.get('/:id', validateInput(equipmentSchema.fetchEquipmentByIdSchema, 'params'), verifyToken, equipmentController.fetchEquipmentById);

module.exports = router;