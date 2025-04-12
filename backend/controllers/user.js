const multer = require('multer');
const { getUserByEmail, addAdditionalInfo } = require('../models/user');
const User = require('../models/user').userModel;
const { addBugReport } = require('../models/bugReport');
const { addContactUs } = require('../models/contactUs');
const { gettop5Notification } = require('../models/notification');
const storage = multer.memoryStorage();
const { redis, generateCacheKey } = require('../redis-server');

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

const addContactUsController = async (req, res) => {
    const { name, email, subject, message } = req.body;
    // console.log(name, email, subject, message);
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const result = await addContactUs(name, email, subject, message);
    if (!result) {
        return res.status(500).json({ error: "Failed to add contact us" });
    }
    res.status(200).json({ message: "Contact us added successfully" });
}


const addMoreData = async ({email, username, bio, file}) => {
    try {
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }
        const updateFields = { 
            username: username.trim(), 
            ...(bio && { bio: bio.trim() }) 
        };
        if (file) {
            updateFields.profilePic = {
                data: file.buffer,
                contentType: file.mimetype,
            };
        }
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

        // Delete the user's cached data
        try {
            const cacheKey = generateCacheKey({ path: 'getprofiledata' }, email);
            await redis.del(cacheKey);
            console.log('Cache cleared for user:', email);
        } catch (redisError) {
            console.warn('Failed to clear Redis cache:', redisError);
            // Continue execution even if cache clearing fails
        }

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

const getProfileData = async (req, res) => {
    const email = req.userData.email;
    const cacheKey = generateCacheKey(req, email);
    try {
        let userData;
        try {
            const cachedData = await redis.get(cacheKey);
            if(cachedData) {
                return res.json(JSON.parse(cachedData));
            }
        } catch (redisError) {
            console.warn('Redis cache error:', redisError);
        }

        const user = await getUserByEmail(email);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userResponse = user.toObject();
        if(userResponse.profilePic && userResponse.profilePic.data) {
            userResponse.profilePic = {
                contentType: userResponse.profilePic.contentType,
                data: userResponse.profilePic.data.toString('base64')
            };
        }

        const selectedData = {
            email: userResponse.email,
            name: userResponse.username,
            bio: userResponse.bio,
            profilePic: userResponse.profilePic,
            additionalInfo: userResponse.additionalInfo || {
                location: '',
                occupation: '',
                socialLinks: {
                    github: '',
                    twitter: '',
                    linkedin: '',
                    website: ''
                }
            }
        };

        try {
            await redis.set(cacheKey, JSON.stringify(selectedData), 'EX', 3600);
        } catch (redisError) {
            console.warn('Redis cache set error:', redisError);
        }
        res.json(selectedData);
    } catch (err) {
        console.error('Get profile data error:', err);
        res.status(500).json({ 
            error: 'An error occurred while retrieving profile data.',
            message: err.message 
        });
    }
}

const updateAdditionalInfo = async (req, res) => {
    const email = req.userData.email;
    const { location, occupation, socialLinks } = req.body;
    try {
        const cacheKey = generateCacheKey({ path: 'getprofiledata' }, email);
        try {
            await redis.del(cacheKey);
        } catch (redisError) {
            console.warn('Failed to clear Redis cache:', redisError);
        }
        const updatedUser = await addAdditionalInfo(email, { location, occupation, socialLinks });
        res.json({
            message: 'Additional info updated successfully',
            additionalInfo: updatedUser.additionalInfo
        });
    } catch (err) {
        console.error('Update additional info error:', err);
        res.status(500).json({ 
            error: 'An error occurred while updating additional info',
            message: err.message 
        });
    }
};

const getUserData = async (req, res) => {
    const email = req.userData.email;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({
            billingInfo: user.billingInfo || { amount: 0, monthlyBills: [] },
            monthlyBills: user.monthlyBills || [],
            containerUsage: user.containerUsage || { totalContainers: 0, monthlyUsage: [] }
        });
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

const getTop5NotificationsController = async (req, res) => {
    try {
        const notifications = await gettop5Notification();
        if (!notifications) {
            return res.status(500).json({ message: "Failed to fetch notifications" });
        }
        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching top 5 notifications:', error);
        res.status(500).json({ message: "Error fetching notifications" });
    }
};


module.exports = {
    addMoreData,
    getUserData,
    addBugReportController,
    addContactUsController,
    getTop5NotificationsController,
    upload,
    getProfileData,
    updateAdditionalInfo
};