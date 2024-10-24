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

/**
 * @swagger
 * /api/equipment:
 *   get:
 *     summary: Fetch all equipment
 *     description: This endpoint requires authorization token
 *     tags: [Equipment]
 *     responses:
 *       200:
 *         description: Successfully retrieved equipment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: int
 *                   name:
 *                     type: string
 *             examples:
 *               AllEquipment:
 *                 value:
 *                   - id: 1
 *                     name: "Sztanga"
 *                   - id: 2
 *                     name: "Hantle"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Equipment not found (there might be no equipment in database)
 * /api/equipment/{id}:
 *   get:
 *     summary: Fetch single equipment by its ID
 *     description: This endpoint requires authorization token
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved equipment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipment'
 *       400:
 *         description: Bad request - Invalid equipment ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Equipment not found
 * components:
 *   schemas:
 *     Equipment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Sztanga"
 */