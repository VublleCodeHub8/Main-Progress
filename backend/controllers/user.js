const express = require('express');
const { getUserByEmail, editUser } = require('../models/user');

const addMoreData = async (req, res) => {
    const { bio, profilePic } = req.body;
    const email = req.userData.email;  
    const username = req.userData.username;
    try {
        // (email, username, bio, profilePic)
        await editUser(email, username, bio, profilePic, ); 

        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
};

const getUserData = async (req, res) => {
    const email = req.userData.email;  
    try {
        const doc = await getUserByEmail(email);
        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
};

exports.addMoreData = addMoreData;
exports.getUserData = getUserData;