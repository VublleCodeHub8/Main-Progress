const express = require('express');
const router = express.Router();

const { runContainer, createContainer, listAllContainers, continerInspects, stopContainer, restartContainer, startContainer, deleteContainer, getContainerCPUandMemoryStats, getContainerDetails, editContainer, getTemplateNameFromContainerId } = require('../controllers/container')

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
 *     tags: [Containers]
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
 *     tags: [Containers]
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
router.get('/runcontainer/:containerId', runContainer)

/**
 * @swagger
 * /container/listcontainers:
 *   get:
 *     tags: [Containers]
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
 *     tags: [Containers]
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
router.get('/inspect/:containerId', continerInspects)

/**
 * @swagger
 * /container/stop/{containerId}:
 *   get:
 *     tags: [Containers]
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
router.get('/stop/:containerId', stopContainer)

/**
 * @swagger
 * /container/restart/{containerId}:
 *   get:
 *     tags: [Containers]
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
router.get('/restart/:containerId', restartContainer)

/**
 * @swagger
 * /container/start/{containerId}:
 *   get:
 *     tags: [Containers]
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
router.get('/start/:containerId', startContainer)

/**
 * @swagger
 * /container/delete/{containerId}:
 *   delete:
 *     tags: [Containers]
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
router.delete('/delete/:containerId', deleteContainer)

/**
 * @swagger
 * /container/stats/{containerId}:
 *   get:
 *     tags: [Containers]
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
router.get('/stats/:containerId', getContainerCPUandMemoryStats)

/**
 * @swagger
 * /container/details/{containerId}:
 *   get:
 *     tags: [Containers]
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
router.get('/details/:containerId', getContainerDetails)

/**
 * @swagger
 * /container/templateName/{containerId}:
 *   get:
 *     tags: [Containers]
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
router.get('/templateName/:containerId', getTemplateNameFromContainerId)

/**
 * @swagger
 * /container/edit/{containerId}:
 *   put:
 *     tags: [Containers]
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
router.put('/edit/:containerId', editContainer)

exports.containerRouter = router;