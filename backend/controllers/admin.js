const { allUsers, changeRole } = require('../models/user');
const { allContainers } = require('../models/containers');
const { allAuth , deleteToken } = require('../models/auth');
const { addtemplate, removetemplate } = require('../models/user');

const getAllUsers = async (req, res) => {
    const data = await allUsers();
    if (!data) {
        res.status(500);
        res.send();
    }
    res.json(data);
}

const addTemplate = async (req, res) => {
    try {
        const { email, templateId } = req.body;

        if (!email || !templateId) {
            return res.status(400).json({ error: "Email and Template ID are required" });
        }

        const data = await addtemplate(email, templateId);
        res.status(200).json({ message: "Template assigned successfully", data });

    } catch (error) {
        console.error("Error adding template:", error);

        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        } else if (error.message === "Template already assigned to the user") {
            return res.status(400).json({ error: "Template already assigned to the user" });
        } else {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};


const getAllContainers = async (req, res) => {
    const data = await allContainers();
    // console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.json(data);
}

const getAllAuth = async (req, res) => {
    const data = await allAuth();
    // console.log(data);
    res.json(data);
}

const roleChange = async (req, res) => {
    const email = req.body.email;
    const data = await changeRole(email);
    // console.log(data);
    res.json(data);
}

const adminLogout = async (req, res) => {
    const email = req.body.email;
    const data = await deleteToken(email);
    // console.log(data);
    res.json(data);
}

const removeTemplate = async (req, res) => {
    try{
        const { email, templateId } = req.body;
        if(!email || !templateId){
            return res.status(400).json({ error: "Email and Template ID are required" });
        }
        const data = await removetemplate(email, templateId);
        res.status(200).json({ message: "Template removed successfully", data });
    } catch (error) {
        console.error("Error removing template:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



exports.getAllAuth = getAllAuth;
exports.getAllContainers = getAllContainers;
exports.getAllUsers = getAllUsers;
exports.adminLogout = adminLogout;
exports.roleChange = roleChange;
exports.addTemplate = addTemplate;
exports.removeTemplate = removeTemplate;