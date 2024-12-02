const express = require('express');
const router = express.Router();

const { getAllTemplates, addNewTemplate, updateTemplate } = require('../controllers/dev');



router.get('/getAllTemplates', getAllTemplates)

router.post('/addNewTemplate', addNewTemplate)

router.post('/updateTemplate', updateTemplate)


exports.devRouter = router;