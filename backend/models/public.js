const mongoose = require('mongoose');

const publicModel = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    flag: {
        type: Boolean,
        default: false
    },
    publishStatus: {
        type: Boolean, 
        default: false
    },
    port: {
        type: Number,
        required: true
    },
    containerId: {
        type: String,
        required: true
    }
});

// Adding indexes for common search and lookup operations
// 1. Title index for frontend search with text capabilities
publicModel.index({ title: 'text' }, { name: 'title_text_index' });
// 2. ContainerId index for frequent lookups in multiple functions
publicModel.index({ containerId: 1 }, { name: 'containerId_index' });

const Public = mongoose.model('Public', publicModel);

const createPublish = async (title, owner, description, port, containerId) => {
    try {
        const public = new Public({ title, owner, description, port, publishStatus: true, containerId });
        await public.save();
        return true;
    } catch (error) {
        return false;
    }
}

const getpublishBycontainerId = async (containerId) => {
    try {
        const public = await Public.findOne({ containerId });
        if (!public) {
            return null;
        }
        return public;
    } catch (error) {
        return null;
    }
}

const getstatus = async (containerId) => {
    try {
        const public = await Public.findOne({ containerId });
        if (!public) {
            return false;
        }
        return public.publishStatus;
    } catch (error) {
        return false;
    }
}

const makepublic = async (containerId) => {
    try {
        const public = await Public.findOne({ containerId });
        if (!public) {
            return false;
        }
        public.flag = true;
        await public.save();
        return true;
    } catch (error) {
        return false;
    }
}

const makeprivate = async (containerId) => {
    try {
        const public = await Public.findOne({ containerId });
        if (!public) {
            return false;
        }
        public.flag = false;
        await public.save();
        return true;
    } catch (error) {
        return false;
    }
}

const checkflag = async (containerId) => {
    try {
        const public = await Public.findOne({ containerId });
        if (!public) {
            return false;
        }
        return public.flag;
    } catch (error) {
        return false;
    }
}

const getAllPublish = async () => {
    try {
        const publics = await Public.find();
        return publics;
    } catch (error) {
        return false;
    }
}

// Delete public entry by containerId
const deletePublic = async (containerId) => {
    try {
        const publicEntry = await Public.findOneAndDelete({ containerId });
        if (!publicEntry) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = { createPublish, getAllPublish, makepublic, makeprivate, deletePublic, getstatus, getpublishBycontainerId, checkflag };
