//const express = require('express');
//const router = express.Router();
//const friendsController = require('../controllers/friendsController');
//const authController = require('../controllers/authController');
//const friendsSchema = require('../schemas/friendsSchema');

// AUTH ROUTES
// TODO: GET /friends
// TODO: GET /friends/requests
// TODO: POST /friends/request/:to_id
// TODO: POST /friends/accept/:from_id
// TODO: POST /friends/reject/:from_id
// TODO: DELETE /friends/:id
// TODO: GET /friends/activity

// module.exports = router;

/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: Get friends list of currently logged user
 *     description: This endpoint requires authorization token
 *     tags: [Friends]
 *     responses:
 *       200:
 *         description: Successfully retrieved friends list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Not Found - Friend list is empty
 * /api/friends/{id}:
 *   delete:
 *     summary: Delete friend or friend request by ID of friend
 *     description: This endpoint requires authorization token
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted friend
 *       400:
 *         description: Bad request - Invalid user ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Not Found - Friend not found
 * /api/friends/requests:
 *   get:
 *     summary: Get friend requests for currently logged user
 *     description: This endpoint requires authorization token
 *     tags: [Friends]
 *     responses:
 *       200:
 *         description: Successfully retrieved friend requests
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Not Found - No friend requests
 * /api/friends/request/{to_id}:
 *   post:
 *     summary: Sends friend request from currently logged user to user with provided ID
 *     description: This endpoint requires authorization token
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: to_id
 *         description: ID of user to send friend request to
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully sent friend request
 *       400:
 *         description: Bad request - Invalid user ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Not Found - User not found
 *       409:
 *         description: Conflict - User is already friends with specified user
 * /api/friends/accept/{from_id}:
 *   post:
 *     summary: Accepts friend request from user with provided ID by
 *     description: This endpoint requires authorization token
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: from_id
 *         description: ID of user to accept friend request from
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully accepted friend request
 *       400:
 *         description: Bad request - Invalid user ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Not Found - Request not found
 *       409:
 *         description: Conflict - Request already accepted/rejected
 * /api/friends/reject/{from_id}:
 *   post:
 *     summary: Rejects friend request from user with provided ID
 *     description: This endpoint requires authorization token
 *     tags: [Friends]
 *     parameters:
 *       - in: body
 *         name: user_id
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: integer
 *               example: 1
 *    responses:
 *      200:
 *        description: Successfully rejected friend request
 *      400:
 *        description: Bad request - Invalid user ID
 *      401:
 *        description: Unauthorized - Invalid or missing token
 *      404:
 *        description: Not Found - Request not found
 *      409:
 *        description: Conflict - Request already accepted/rejected
 * /api/friends/activity:
 *   get:
 *     summary: Get friends activity
 *     description: This endpoint requires authorization token
 *     tags: [Friends]
 *     responses:
 *       200:
 *         description: Successfully retrieved friends activity
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Not Found - No friends activity found
 */
