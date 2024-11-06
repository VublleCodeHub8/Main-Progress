const { allUsers } = require('../models/user');
const { allContainers } = require('../models/containers');
const { allAuth } = require('../models/auth');

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



exports.getAllAuth = getAllAuth;
exports.getAllContainers = getAllContainers;
exports.getAllUsers = getAllUsers;

