const { allUsers, changeRole } = require('../models/user');
const { allContainers } = require('../models/containers');
const { allAuth , deleteToken } = require('../models/auth');
const { addtemplate, removetemplate } = require('../models/user');
const { getAllBugReports, deleteBugReport, toggleSeenStatus } = require('../models/bugReport');
const { getAllContainerHistory } = require('../models/containerHistory');
const { getAllContactUs, deleteContactUs } = require('../models/contactUs');
const { redis, generateCacheKey } = require('../redis-server');

const getAllUsers = async (req, res) => {
    try{
        const cacheKey = generateCacheKey(req, 'admin');
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        const data = await allUsers();
        if (!data) {
            res.status(500);
            res.send();
        }
        try {
            await redis.set(cacheKey, JSON.stringify(data), 'EX', 3600); 
        } catch (redisError) {
            console.warn('Redis cache set error:', redisError);
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ 
            error: 'An error occurred while getting all users',
            message: err.message 
        });
    }
}

const addTemplate = async (req, res) => {
    try {
        const { email, templateId } = req.body;

        if (!email || !templateId) {
            return res.status(400).json({ error: "Email and Template ID are required" });
        }
        const cacheKey = generateCacheKey({path: 'getAllUsers'}, 'admin');
        try{
            await redis.del(cacheKey);
        } catch (redisError) {
            console.warn('Failed to clear Redis cache:', redisError);
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
    if (!data) {
        res.status(500);
        res.send();
    }
    res.json(data);
}

const getAllAuth = async (req, res) => {
    try{
        const cacheKey = generateCacheKey(req, 'admin');
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        const data = await allAuth();
        if (!data) {
            res.status(500);
            res.send();
        }
        try {
            await redis.set(cacheKey, JSON.stringify(data), 'EX', 3600); 
        } catch (redisError) {
            console.warn('Redis cache set error:', redisError);
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('Get all auth error:', err);
        res.status(500).json({ 
            error: 'An error occurred while getting all auth',
            message: err.message 
        });
    }
}

const roleChange = async (req, res) => {
    const email = req.body.email;
    const cacheKey = generateCacheKey({path: 'getAllUsers'}, 'admin');
    try{
        await redis.del(cacheKey);
    } catch (redisError) {
        console.warn('Failed to clear Redis cache:', redisError);
    }
    const data = await changeRole(email);
    res.json(data);
}

const adminLogout = async (req, res) => {
    const email = req.body.email;
    const cacheKey = generateCacheKey({path: 'getAllAuth'}, 'admin');
    try{
        await redis.del(cacheKey);
    } catch (redisError) {
        console.warn('Failed to clear Redis cache:', redisError);
    }
    const data = await deleteToken(email);
    res.json(data);
}

const removeTemplate = async (req, res) => {
    try{
        const { email, templateId } = req.body;
        if(!email || !templateId){
            return res.status(400).json({ error: "Email and Template ID are required" });
        }
        const cacheKey = generateCacheKey({path: 'getAllUsers'}, 'admin');
        try{
            await redis.del(cacheKey);
        } catch (redisError) {
            console.warn('Failed to clear Redis cache:', redisError);
        }
        const data = await removetemplate(email, templateId);
        res.status(200).json({ message: "Template removed successfully", data });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

const getAllBugReportsController = async (req, res) => {
    const bugReports = await getAllBugReports();
    if (!bugReports) {
        return res.status(500).json({ error: "Failed to get bug reports" });
    }
    res.status(200).json(bugReports);
}

const deleteBugReportController = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }
    const data = await deleteBugReport(id);
    res.status(200).json({ message: "Bug report deleted successfully", data });
}

const getAllContainerHistoryController = async (req, res) => {
    const cacheKey = generateCacheKey(req, 'admin');
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }
    const containerHistory = await getAllContainerHistory();
    if (!containerHistory) {
        return res.status(500).json({ error: "Failed to get container history" });
    }
    try {
        await redis.set(cacheKey, JSON.stringify(containerHistory), 'EX', 3600); 
    } catch (redisError) {
        console.warn('Redis cache set error:', redisError);
    }
    res.status(200).json(containerHistory);
}

const getAllContactUsController = async (req, res) => {
    const cacheKey = generateCacheKey(req, 'admin');
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }
    const contactUs = await getAllContactUs();
    if (!contactUs) {
        return res.status(500).json({ error: "Failed to get contact us" });
    }
    try {
        await redis.set(cacheKey, JSON.stringify(contactUs), 'EX', 3600); 
    } catch (redisError) {
        console.warn('Redis cache set error:', redisError);
    }
    res.status(200).json(contactUs);
}

const deleteContactUsController = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }
    const data = await deleteContactUs(id);
    res.status(200).json({ message: "Contact us deleted successfully", data });
}

const toggleBugReportSeenStatus = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: "Bug report ID is required" });
    }

    const success = await toggleSeenStatus(id);
    if (!success) {
        return res.status(500).json({ error: "Failed to toggle bug report seen status" });
    }
    res.status(200).json({ message: "Bug report seen status toggled successfully" });
};

module.exports = {
    getAllUsers,
    getAllAuth,
    getAllContainers,
    adminLogout,
    roleChange,
    addTemplate,
    removeTemplate,
    getAllBugReportsController,
    deleteBugReportController,
    getAllContainerHistoryController,
    getAllContactUsController,
    deleteContactUsController,
    toggleBugReportSeenStatus
}