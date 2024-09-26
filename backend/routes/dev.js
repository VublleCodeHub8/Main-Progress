const express = require('express');
const router = express.Router();

const { allTemplate, addTemplate } = require('../models/template');



router.get('/getAllTemplates', async (req, res) => {
    const data = await allTemplate();
    console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.json(data);
})

router.post('/addNewTemplate', async (req, res) => {
    const dataToAdd = req.body;
    const data = await addTemplate(dataToAdd.name, dataToAdd.image);
    console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.status(200);
    res.send();
})




exports.devRouter = router;