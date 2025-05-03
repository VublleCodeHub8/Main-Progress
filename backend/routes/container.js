const express = require('express');
const router = express.Router();

const { runContainer, createContainer, listAllContainers, continerInspects, stopContainer, restartContainer, startContainer, 
    deleteContainer, getContainerCPUandMemoryStats, getContainerDetails, editContainer, getTemplateNameFromContainerId, getcontainerById } = require('../controllers/container');
const verifyContainerOwnership = require('../middlewares/verifyContainerOwnership');

/**
 * @swagger
 * tags:
 *   name: Containers
 *   description: Container management API endpoints
 */

/**
 * @swagger
 * /container/createcontainer:
 *   get:
 *     tags: [B2C, Containers]
 *     summary: Create a new container
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Container created successfully
 *       500:
 *         description: Server error
 */
router.get('/createcontainer', createContainer) 

/**
 * @swagger
 * /container/runcontainer/{containerId}:
 *   get:
 *     tags: [B2C, Containers]
 *     summary: Run a specific container
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the container to run
 *     responses:
 *       200:
 *         description: Container started successfully
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.get('/runcontainer/:containerId', verifyContainerOwnership, runContainer)

/**
 * @swagger
 * /container/listcontainers:
 *   get:
 *     tags: [B2B, Containers]
 *     summary: List all containers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all containers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.get('/listcontainers', listAllContainers)

/**
 * @swagger
 * /container/inspect/{containerId}:
 *   get:
 *     tags: [B2C, Containers]
 *     summary: Inspect a specific container
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Container inspection details
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.get('/inspect/:containerId', verifyContainerOwnership, continerInspects)

/**
 * @swagger
 * /container/stop/{containerId}:
 *   get:
 *     tags: [B2C, Containers]
 *     summary: Stop a running container
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Container stopped successfully
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.get('/stop/:containerId', verifyContainerOwnership, stopContainer)

/**
 * @swagger
 * /container/getContainerById/{containerId}:
 *   get:
 *     tags: [B2C, Containers]
 *     summary: Get container by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the container to retrieve
 *     responses:
 *       200:
 *         description: Container details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 containerId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 port:
 *                   type: string
 *                 secondaryPort:
 *                   type: string
 *                 image:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 lastUsed:
 *                   type: string
 *                 template:
 *                   type: string
 *                 startedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */

router.get('/getContainerById/:containerId', verifyContainerOwnership, getcontainerById)
/**
 * @swagger
 * /container/restart/{containerId}:
 *   get:
 *     tags: [B2C, Containers]
 *     summary: Restart a container
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Container restarted successfully
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.get('/restart/:containerId', verifyContainerOwnership, restartContainer)

/**
 * @swagger
 * /container/start/{containerId}:
 *   get:
 *     tags: [B2C, Containers]
 *     summary: Start a stopped container
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Container started successfully
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.get('/start/:containerId', verifyContainerOwnership, startContainer)

/**
 * @swagger
 * /container/delete/{containerId}:
 *   delete:
 *     tags: [B2C, Containers]
 *     summary: Delete a container
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Container deleted successfully
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:containerId', verifyContainerOwnership, deleteContainer)

/**
 * @swagger
 * /container/stats/{containerId}:
 *   get:
 *     tags: [B2C, Containers]
 *     summary: Get container CPU and memory statistics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Container statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cpu:
 *                   type: number
 *                 memory:
 *                   type: number
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.get('/stats/:containerId', verifyContainerOwnership, getContainerCPUandMemoryStats)

/**
 * @swagger
 * /container/details/{containerId}:
 *   get:
 *     tags: [B2C, Containers]
 *     summary: Get detailed information about a container
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Container details
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.get('/details/:containerId', verifyContainerOwnership, getContainerDetails)

/**
 * @swagger
 * /container/templateName/{containerId}:
 *   get:
 *     tags: [B2C, Containers]
 *     summary: Get template name for a container
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 templateName:
 *                   type: string
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.get('/templateName/:containerId', verifyContainerOwnership, getTemplateNameFromContainerId)

/**
 * @swagger
 * /container/edit/{containerId}:
 *   put:
 *     tags: [B2C, Containers]
 *     summary: Edit container configuration
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               config:
 *                 type: object
 *     responses:
 *       200:
 *         description: Container updated successfully
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.put('/edit/:containerId', verifyContainerOwnership, editContainer)

exports.containerRouter = router;