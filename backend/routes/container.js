const express = require('express');
const router = express.Router();

const { runContainer, createContainer } = require('../controllers/container')

router.post('/createcontainer', createContainer)

router.get('/runcontainer/:containerId', runContainer)

exports.containerRouter = router;