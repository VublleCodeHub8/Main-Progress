const { allTemplate, addTemplate, updateTemplates, deleteTemplates, findTemplateById } = require('../models/template');
const { allContainers } = require('../models/containers');
const { getUserByEmail } = require('../models/user');

const getAllTemplates = async (req, res) => {
    const data = await allTemplate();
    // console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.json(data);
}

const addNewTemplate = async (req, res) => {
    const dataToAdd = req.body;
    const data = await addTemplate(dataToAdd.name, dataToAdd.image, dataToAdd.phase, dataToAdd.description, dataToAdd.price);
    // console.log(data);
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
    // console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.status(200);
    res.send();
}

const getAllContainers = async (req, res) => {
    const data = await allContainers();
    if (!data) {
        res.status(500);
        res.send();
    }
    res.json(data);
}

const getUserTemplates = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const user = await getUserByEmail(userEmail);
        const templateIds = user.assignedTemplates;
        const templates = await Promise.all(templateIds.map(id => findTemplateById(id)));
        res.json(templates);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send();
    }
}

exports.getAllTemplates = getAllTemplates;
exports.addNewTemplate = addNewTemplate;
exports.updateTemplate = updateTemplate;
exports.deleteTemplate = deleteTemplate;
exports.getAllContainers = getAllContainers;
exports.getUserTemplates = getUserTemplates;
