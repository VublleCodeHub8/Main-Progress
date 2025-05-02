const express = require('express');
const router = express.Router();

const { getAllAuth, getAllUsers, getAllContainers , adminLogout , roleChange, addTemplate, removeTemplate,
    getAllBugReportsController, deleteBugReportController, getAllContainerHistoryController, getAllContactUsController, 
    deleteContactUsController, toggleBugReportSeenStatus
 } = require('../controllers/admin')

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /admin/getAllUsers:
 *   get:
 *     tags: [B2B, Admin]
 *     summary: Get all users in the system
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/getAllUsers', getAllUsers)

/**
 * @swagger
 * /admin/getAllContainers:
 *   get:
 *     tags: [B2B, Admin]
 *     summary: Get all containers in the system
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all containers
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/getAllContainers', getAllContainers)

/**
 * @swagger
 * /admin/getAllAuth:
 *   get:
 *     tags: [B2B, Admin]
 *     summary: Get all authentication records
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all auth records
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/getAllAuth', getAllAuth)

/**
 * @swagger
 * /admin/adminLogout:
 *   post:
 *     tags: [B2B, Admin]
 *     summary: Logout admin user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/adminLogout', adminLogout)

/**
 * @swagger
 * /admin/roleChange:
 *   post:
 *     tags: [B2B, Admin]
 *     summary: Change user role
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin, dev]
 *     responses:
 *       200:
 *         description: Role changed successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/roleChange', roleChange)

/**
 * @swagger
 * /admin/addTemplate:
 *   post:
 *     tags: [B2B, Admin]
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
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/addTemplate', addTemplate)

/**
 * @swagger
 * /admin/removeTemplate:
 *   post:
 *     tags: [B2B, Admin]
 *     summary: Remove a template
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - templateId
 *             properties:
 *               templateId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Template removed successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/removeTemplate', removeTemplate)

/**
 * @swagger
 * /admin/getAllBugReports:
 *   get:
 *     tags: [B2B, Admin]
 *     summary: Get all bug reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bug reports
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/getAllBugReports', getAllBugReportsController)

/**
 * @swagger
 * /admin/deleteBugReport:
 *   delete:
 *     tags: [B2B, Admin]
 *     summary: Delete a bug report
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportId
 *             properties:
 *               reportId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bug report deleted successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete('/deleteBugReport', deleteBugReportController)

/**
 * @swagger
 * /admin/getAllContainerHistory:
 *   get:
 *     tags: [B2B, Admin]
 *     summary: Get container history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of container history
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/getAllContainerHistory', getAllContainerHistoryController)

/**
 * @swagger
 * /admin/getAllContactUs:
 *   get:
 *     tags: [B2B, Admin]
 *     summary: Get all contact us messages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all contact messages
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/getAllContactUs', getAllContactUsController)

/**
 * @swagger
 * /admin/deleteContactUs:
 *   delete:
 *     tags: [B2B, Admin]
 *     summary: Delete a contact us message
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messageId
 *             properties:
 *               messageId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact message deleted successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete('/deleteContactUs', deleteContactUsController)

/**
 * @swagger
 * /admin/toggleBugReportSeen:
 *   post:
 *     tags: [B2B, Admin]
 *     summary: Toggle bug report seen status
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportId
 *             properties:
 *               reportId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bug report status toggled successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/toggleBugReportSeen', toggleBugReportSeenStatus);

exports.adminRouter = router;