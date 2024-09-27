const express = require('express');
const router = express.Router();

const { runContainer, createContainer, listAllContainers } = require('../controllers/container')

router.get('/createcontainer', createContainer)

router.get('/runcontainer/:containerId', runContainer)

router.get('/listcontainers', listAllContainers)

exports.containerRouter = router;