const express = require('express');
const router = express.Router();

const { runContainer, createContainer, listAllContainers, continerInspects, stopContainer, restartContainer, startContainer, deleteContainer, getContainerCPUandMemoryStats, getContainerDetails} = require('../controllers/container')

router.get('/createcontainer', createContainer)

router.get('/runcontainer/:containerId', runContainer)

router.get('/listcontainers', listAllContainers)

router.get('/inspect/:containerId', continerInspects)

router.get('/stop/:containerId', stopContainer)

router.get('/restart/:containerId', restartContainer)

router.get('/start/:containerId', startContainer)

router.delete('/delete/:containerId', deleteContainer)

router.get('/stats/:containerId', getContainerCPUandMemoryStats)

router.get('/details/:containerId', getContainerDetails)



exports.containerRouter = router;