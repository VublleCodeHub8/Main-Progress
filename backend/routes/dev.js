const express = require('express');
const router = express.Router();

const { getAllTemplates, addNewTemplate, updateTemplate, deleteTemplate, getAllContainers } = require('../controllers/dev');



router.get('/getAllTemplates', getAllTemplates)

router.post('/addNewTemplate', addNewTemplate)

router.post('/updateTemplate', updateTemplate)

router.delete('/deleteTemplate/:id', deleteTemplate)

router.get('/getAllContainers', getAllContainers)


exports.devRouter = router;