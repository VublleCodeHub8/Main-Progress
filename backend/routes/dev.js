const express = require('express');
const router = express.Router();

const { getAllTemplates, addNewTemplate, updateTemplate, deleteTemplate, getAllContainers, 
    getUserTemplates, createNotificationController, getAllNotificationController, deleteNotificationController 
    , getAllBugReportsController } = require('../controllers/dev');

/**
 * @swagger
 * tags:
 *   name: Developer
 *   description: Developer API endpoints
 */

/**
 * @swagger
 * /dev/getAllTemplates:
 *   get:
 *     tags: [B2B, Developer]
 *     summary: Get all templates
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all templates
 *       500:
 *         description: Server error
 */
router.get('/getAllTemplates', getAllTemplates)

/**
 * @swagger
 * /dev/addNewTemplate:
 *   post:
 *     tags: [B2B, Developer]
 *     summary: Add a new template
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Template added successfully
 *       500:
 *         description: Server error
 */
router.post('/addNewTemplate', addNewTemplate)

/**
 * @swagger
 * /dev/updateTemplate:
 *   post:
 *     tags: [B2B, Developer]
 *     summary: Update an existing template
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       500:
 *         description: Server error
 */
router.post('/updateTemplate', updateTemplate)

/**
 * @swagger
 * /dev/deleteTemplate/{id}:
 *   delete:
 *     tags: [B2B, Developer]
 *     summary: Delete a template
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/deleteTemplate/:id', deleteTemplate)

/**
 * @swagger
 * /dev/getAllContainers:
 *   get:
 *     tags: [B2B, Developer]
 *     summary: Get all containers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all containers
 *       500:
 *         description: Server error
 */
router.get('/getAllContainers', getAllContainers)

/**
 * @swagger
 * /dev/getUserTemplates/{email}:
 *   get:
 *     tags: [B2B, Developer]
 *     summary: Get templates by user email
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user templates
 *       500:
 *         description: Server error
 */
router.get('/getUserTemplates/:email', getUserTemplates)

/**
 * @swagger
 * /dev/getAllBugReports:
 *   get:
 *     tags: [B2B, Developer]
 *     summary: Get all bug reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bug reports
 *       500:
 *         description: Server error
 */
router.get('/getAllBugReports', getAllBugReportsController);

/**
 * @swagger
 * /dev/notification:
 *   post:
 *     tags: [B2B, Developer]
 *     summary: Create a new notification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification created successfully
 *       500:
 *         description: Server error
 */
router.post('/notification', createNotificationController);

/**
 * @swagger
 * /dev/notifications:
 *   get:
 *     tags: [B2B, Developer]
 *     summary: Get all notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all notifications
 *       500:
 *         description: Server error
 */
router.get('/notifications', getAllNotificationController);

/**
 * @swagger
 * /dev/notification/{id}:
 *   delete:
 *     tags: [B2B, Developer]
 *     summary: Delete a notification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/notification/:id', deleteNotificationController);

exports.devRouter = router;