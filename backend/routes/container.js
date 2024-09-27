const express = require('express');
const router = express.Router();

const { runContainer, createContainer, listAllContainers } = require('../controllers/container')

router.get('/createcontainer', createContainer)

router.get('/runcontainer/:containerId', runContainer)

router.get('/listcontainers', listAllContainers)

// router.get('/deletecontainer/:containerId', deleteContainer)

exports.containerRouter = router;