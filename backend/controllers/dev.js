const { allTemplate, addTemplate, updateTemplates } = require('../models/template');

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
    const data = await addTemplate(dataToAdd.name, dataToAdd.image, dataToAdd.phase, dataToAdd.description, dataToAdd.price);
    console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.status(200);
    res.send();
}

const updateTemplate = async (req, res) => {
    const dataToUpdate = req.body;
    // console.log(dataToUpdate);  
    const data = await updateTemplates(dataToUpdate.id, dataToUpdate);
    // console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.status(200);
    res.send();
}

exports.getAllTemplates = getAllTemplates;
exports.addNewTemplate = addNewTemplate;
exports.updateTemplate = updateTemplate;