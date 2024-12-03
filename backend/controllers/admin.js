const { allUsers, changeRole } = require('../models/user');
const { allContainers } = require('../models/containers');
const { allAuth , deleteToken } = require('../models/auth');

const getAllUsers = async (req, res) => {
    const data = await allUsers();
    console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.json(data);
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

const getAllAuth = async (req, res) => {
    const data = await allAuth();
    console.log(data);
    res.json(data);
}

const roleChange = async (req, res) => {
    const email = req.body.email;
    const data = await changeRole(email);
    console.log(data);
    res.json(data);
}

const adminLogout = async (req, res) => {
    const email = req.body.email;
    const data = await deleteToken(email);
    console.log(data);
    res.json(data);
}



exports.getAllAuth = getAllAuth;
exports.getAllContainers = getAllContainers;
exports.getAllUsers = getAllUsers;
exports.adminLogout = adminLogout;
exports.roleChange = roleChange;