const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const authController = require('../controllers/authController');

// AUTH ROUTES
router.get('/', authController.verifyToken, equipmentController.getEquipment);
router.get('/:id', authController.verifyToken, equipmentController.getEquipmentById);


module.exports = router;

/**
 * @swagger
 * /api/equipment:
 *   get:
 *     summary: Get all equipment
 *     description: This endpoint requires authorization token
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Get single equipment
 *     description: This endpoint requires authorization token
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: int
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Sztanga"
 *       400:
 *         description: Bad request - Invalid equipment ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Equipment not found
 */