const mongoose = require('mongoose');

const notification = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String, 
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

const createNotification = async (title, message) => {
    try {
        const notify = new Notification({title, message});
        await notify.save();
        return true;
    } catch (error){
        console.error('Error creating notification:', error);
        return false;
    }
}

const getAllNotification = async () => {
    try {
        const notify = await Notification.find();
        return notify;
    } catch (error){
        console.log('Error creating notification:', error);
        return false;
    }
}

const gettop5Notification = async () => {
    try {
        const notifications = await Notification.find()
            .sort({ time: -1 }) // Sort by time in descending order (newest first)
            .limit(5); // Limit to 5 results
        return notifications;
    } catch (error) {
        console.error('Error getting top 5 notifications:', error);
        return false;
    }
}

const deleteNotification = async (notificationId) => {
    try {
        const result = await Notification.findByIdAndDelete(notificationId);
        if (!result) {
            console.error('Notification not found');
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error deleting notification:', error);
        return false;
    }
}

const Notification = mongoose.model('Notification', notification);

module.exports = { 
    createNotification, 
    getAllNotification, 
    gettop5Notification,
    deleteNotification 
};