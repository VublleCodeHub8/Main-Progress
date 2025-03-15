const express = require('express');
const router = express.Router();

const { getAllAuth, getAllUsers, getAllContainers , adminLogout , roleChange, addTemplate, removeTemplate } = require('../controllers/admin')



router.get('/getAllUsers', getAllUsers)

router.get('/getAllContainers', getAllContainers)

router.get('/getAllAuth', getAllAuth)

router.post('/adminLogout', adminLogout)

router.post('/roleChange', roleChange)

router.post('/addTemplate', addTemplate)

router.post('/removeTemplate', removeTemplate)

exports.adminRouter = router