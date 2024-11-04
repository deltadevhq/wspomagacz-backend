const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const equipmentSchema = require('../schemas/equipmentSchema');
const { verifyToken } = require('../utilities/middleware/verifyToken');
const { validateInput } = require('../utilities/middleware/validateInput');

// AUTH ROUTES
router.get('/', verifyToken, equipmentController.fetchEquipment);
router.get('/:id', validateInput(equipmentSchema.fetchEquipmentByIdSchema, 'params'), verifyToken, equipmentController.fetchEquipmentById);

module.exports = router;