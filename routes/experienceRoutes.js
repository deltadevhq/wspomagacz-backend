const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController.js');
const authController = require('../controllers/authController');
const experienceSchema = require('../schemas/experienceSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/level-by-xp', authController.verifyToken, validateInput(experienceSchema.getLevelByXpSchema, 'query'), experienceController.getLevelByXp);
router.get('/xp-by-level', authController.verifyToken, validateInput(experienceSchema.getXpByLevelSchema, 'query'), experienceController.getXpByLevel);

module.exports = router;

/**
 * @swagger
 * /api/experience/level-by-xp:
 *   get:
 *     summary: What level is granted by given XP
 *     tags: [Experience]
 *     parameters:
 *       - in: query
 *         name: xp
 *         schema:
 *           type: integer
 *         description: XP value
 *     responses:
 *       200:
 *         description: Successfully retrieved level by XP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 level:
 *                   type: integer
 *                   example: 2
 *                   description: Level granted by given XP
 *                 xp:
 *                   type: integer
 *                   example: 250
 *                   description: XP value
 *                 progress:
 *                   type: number
 *                   example: 0.5
 *                   description: Progress to the next level as a percentage
 *                 missing_xp:
 *                   type: integer
 *                   example: 250
 *                   description: How much XP is needed to reach the next level
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Exercises not found
 * /api/experience/xp-by-level:
 *   get:
 *     summary: How much XP is needed for given level
 *     tags: [Experience]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *         description: Level value
 *     responses:
 *       200:
 *         description: Successfully retrieved XP by level
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 level:
 *                   type: integer
 *                   example: 2
 *                 xp:
 *                   type: integer
 *                   example: 200
 *                   description: How much XP is needed for given level
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Exercises not found
 */
