const { allTemplate, addTemplate } = require('../models/template');

const getAllTemplates = async (req, res) => {
    const data = await allTemplate();
    console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.json(data);
}

const addNewTemplate = async (req, res) => {
    const dataToAdd = req.body;
    const data = await addTemplate(dataToAdd.name, dataToAdd.image);
    console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.status(200);
    res.send();
}

exports.getAllTemplates = getAllTemplates;
exports.addNewTemplate = addNewTemplate;