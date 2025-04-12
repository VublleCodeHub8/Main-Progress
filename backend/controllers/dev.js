const { allTemplate, addTemplate, updateTemplates, deleteTemplates, findTemplateById } = require('../models/template');
const { allContainers } = require('../models/containers');
const { getUserByEmail } = require('../models/user');
const { createNotification, getAllNotification, deleteNotification } = require('../models/notification');
const { getAllBugReports } = require('../models/bugReport');
const { redis, generateCacheKey } = require('../redis-server');

const getAllTemplates = async (req, res) => {
    const cacheKey = generateCacheKey(req, 'dev');
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }
    const data = await allTemplate();
    if (!data) {
        res.status(500);
        res.send();
    }
    try {
        await redis.set(cacheKey, JSON.stringify(data), 'EX', 3600); 
    } catch (redisError) {
        console.warn('Redis cache set error:', redisError);
    }
    res.json(data);
}

const addNewTemplate = async (req, res) => {
    const dataToAdd = req.body;
    try{
        const cacheKey = generateCacheKey({path: 'getAllTemplates'}, 'dev');
        try {
            await redis.del(cacheKey);
        } catch (redisError) {
            console.warn('Failed to clear Redis cache:', redisError);   
        }
        const data = await addTemplate(dataToAdd.name, dataToAdd.image, dataToAdd.phase, dataToAdd.description, dataToAdd.price);
        if (!data) {
            res.status(500);
            res.send();
        }
        res.status(200);
        res.send();
    } catch (err) {
        console.error('Add new template error:', err);
        res.status(500).json({ 
            error: 'An error occurred while adding new template',
            message: err.message 
        });
    }
}

const updateTemplate = async (req, res) => {
    const dataToUpdate = req.body;
    try{
        const cacheKey = generateCacheKey({path: 'getAllTemplates'}, 'dev');
        try {
            await redis.del(cacheKey);
        } catch (redisError) {
            console.warn('Failed to clear Redis cache:', redisError);   
        }
        const data = await updateTemplates(dataToUpdate.id, dataToUpdate);
        if (!data) {
            res.status(500);
            res.send();
        }
        res.status(200);
        res.send();
    } catch (err) {
        console.error('Update template error:', err);
        res.status(500).json({ 
            error: 'An error occurred while updating template',
            message: err.message 
        });
    }
}

const deleteTemplate = async (req, res) => {
    const id = req.params.id;
    try{
        const cacheKey = generateCacheKey({path: 'getAllTemplates'}, 'dev');
        try {
            await redis.del(cacheKey);
        } catch (redisError) {
            console.warn('Failed to clear Redis cache:', redisError);   
        }
        const data = await deleteTemplates(id);
        if (!data) {
            res.status(500);
            res.send();
        }
        res.status(200);
        res.send();
    } catch (err) {
        console.error('Delete template error:', err);
        res.status(500).json({ 
            error: 'An error occurred while deleting template',
            message: err.message 
        });
    }
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

const createNotificationController = async (req, res) => {
    const { title, message } = req.body;
    if (!title || !message) {
        return res.status(400).json({ error: "Title and message are required" });
    }

    const result = await createNotification(title, message);
    if (!result) {
        return res.status(500).json({ error: "Failed to create notification" });
    }
    res.status(201).json({ message: "Notification created successfully" });
};

const getAllNotificationController = async (req, res) => {
    const notifications = await getAllNotification();
    if (!notifications) {
        return res.status(500).json({ error: "Failed to fetch notifications" });
    }
    res.status(200).json(notifications);
};

const deleteNotificationController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Notification ID is required" });
    }

    const result = await deleteNotification(id);
    if (!result) {
        return res.status(404).json({ error: "Notification not found or failed to delete" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
};

const getAllBugReportsController = async (req, res) => {
    const bugReports = await getAllBugReports();
    if (!bugReports) {
        return res.status(500).json({ error: "Failed to get bug reports" });
    }
    res.status(200).json(bugReports);
}


exports.getAllTemplates = getAllTemplates;
exports.addNewTemplate = addNewTemplate;
exports.updateTemplate = updateTemplate;
exports.deleteTemplate = deleteTemplate;
exports.getAllContainers = getAllContainers;
exports.getUserTemplates = getUserTemplates;
exports.createNotificationController = createNotificationController;
exports.getAllNotificationController = getAllNotificationController;
exports.deleteNotificationController = deleteNotificationController;
exports.getAllBugReportsController = getAllBugReportsController;


