const express = require('express');
const router = express.Router();

const { getAllTemplates, addNewTemplate, updateTemplate, deleteTemplate, getAllContainers, 
    getUserTemplates, createNotificationController, getAllNotificationController, deleteNotificationController 
    , getAllBugReportsController } = require('../controllers/dev');



router.get('/getAllTemplates', getAllTemplates)

router.post('/addNewTemplate', addNewTemplate)

router.post('/updateTemplate', updateTemplate)

router.delete('/deleteTemplate/:id', deleteTemplate)

router.get('/getAllContainers', getAllContainers)

router.get('/getUserTemplates/:email', getUserTemplates)

router.get('/getAllBugReports', getAllBugReportsController);

router.post('/notification', createNotificationController);

router.get('/notifications', getAllNotificationController);

router.delete('/notification/:id', deleteNotificationController);

exports.devRouter = router;