const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


const addContactUs = async (name, email, subject, message) => {
    try {
        const contactUs = new ContactUs({name, email, subject, message, createdAt: Date.now()});
        await contactUs.save();
        return true;
    } catch (error) {
        console.error('Error adding contact us:', error);
        return false;
    }
}

const getAllContactUs = async () => {
    try {
        const contactUs = await ContactUs.find();
        return contactUs;
    } catch (error) {
        console.error('Error getting all contact us:', error);
        return [];
    }
}

const deleteContactUs = async (id) => {
    try {
        const contactUs = await ContactUs.findByIdAndDelete(id);
        return true;
    } catch (error) {
        console.error('Error deleting contact us:', error);
        return false;
    }
}


const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = { addContactUs, getAllContactUs, deleteContactUs };