const express = require('express');
const router = express.Router();
const { getFileStruct, getFile } = require('../controllers/project');
const fs = require('fs/promises');
const path = require('path');


router.get('/files', getFileStruct)

router.post('/file', getFile)


exports.projectRouter = router