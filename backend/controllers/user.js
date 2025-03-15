const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { getUserByEmail } = require('../models/user');
const User = require('../models/user').userModel;
const { addBugReport } = require('../models/bugReport');

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed!'), false);
        }
    },
});

const addMoreData = async ({email, username, bio, file}) => {
    

    try {
        // Input validation
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Prepare update fields
        const updateFields = { 
            username: username.trim(), 
            ...(bio && { bio: bio.trim() }) 
        };

        // Handle profile picture
        if (file) {
            updateFields.profilePic = {
                data: file.buffer,
                contentType: file.mimetype,
            };
        }

        // Find and update user
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: updateFields },
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare response
        const responseUser = updatedUser.toObject();
        if (responseUser.profilePic && responseUser.profilePic.data) {
            responseUser.profilePic = {
                contentType: responseUser.profilePic.contentType,
                data: responseUser.profilePic.data.toString('base64')
            };
        }

        return responseUser;
    } 
    catch (err) {
        console.error('Add more data error:', err);
        throw err;
    }
};

const getUserData = async (req, res) => {
    const email = req.userData.email;

    try {
        const user = await getUserByEmail(email);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Create a copy of user to avoid modifying the original document
        const userResponse = user.toObject();
        
        if (userResponse.profilePic && userResponse.profilePic.data) {
            userResponse.profilePic = {
                contentType: userResponse.profilePic.contentType,
                data: userResponse.profilePic.data.toString('base64')
            };
        }

        res.json(userResponse);
    } catch (err) {
        console.error('Get user data error:', err);
        res.status(500).json({ 
            error: 'An error occurred while retrieving user data.',
            message: err.message 
        });
    }
};

const addBugReportController = async (req, res) => {
    const { name, email, type, description } = req.body;
    if (!name || !email || !type || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const result = await addBugReport(name, email, type, description);
    if (!result) {
        return res.status(500).json({ error: "Failed to add bug report" });
    }
    res.status(200).json({ message: "Bug report added successfully" });
}

module.exports = {
    addMoreData,
    getUserData,
    addBugReportController
};