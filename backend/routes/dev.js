const express = require('express');
const router = express.Router();

const { getAllTemplates, addNewTemplate } = require('../controllers/dev');



router.get('/getAllTemplates', getAllTemplates)

router.post('/addNewTemplate', addNewTemplate)


exports.devRouter = router;