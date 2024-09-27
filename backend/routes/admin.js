const express = require('express');
const router = express.Router();

const { getAllAuth, getAllUsers, getAllContainers } = require('../controllers/admin')



router.get('/getAllUsers', getAllUsers)

router.get('/getAllContainers', getAllContainers)

router.get('/getAllAuth', getAllAuth)




exports.adminRouter = router