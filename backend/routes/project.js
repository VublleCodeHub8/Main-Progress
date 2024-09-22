const express = require('express');
const router = express.Router();
const { getFileStruct } = require('../controllers/project');

router.get('/files', getFileStruct)



exports.projectRouter = router