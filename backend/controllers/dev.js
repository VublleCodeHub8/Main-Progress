const { allTemplate, addTemplate, updateTemplates, deleteTemplates } = require('../models/template');
const { allContainers } = require('../models/containers');

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

const deleteTemplate = async (req, res) => {
    const id = req.params.id;
    const data = await deleteTemplates(id);
    console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.status(200);
    res.send();
}

const getAllContainers = async (req, res) => {
    const data = await allContainers();
    console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.json(data);
}

exports.getAllTemplates = getAllTemplates;
exports.addNewTemplate = addNewTemplate;
exports.updateTemplate = updateTemplate;
exports.deleteTemplate = deleteTemplate;
exports.getAllContainers = getAllContainers;
