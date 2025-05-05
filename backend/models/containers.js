const mongoose = require('mongoose');

const containerSchema = mongoose.Schema({
    name: {
        type: String
    },
    id: {
        type: String
    },
    port: {
        type: Number
    },
    secondaryPort: {
        type: Number
    },
    createdAt: {
        type: String
    },
    lastUsed: {
        type: String
    },
    email: {
        type: String
    },
    userId: {
        type: String
    },
    template: {
        type: String
    },
    startedAt: {
        type: Date,
        default: Date.now
    }
});

// Add indexes for optimizing container queries
// 1. ID index - unique container identifier used in multiple queries
containerSchema.index({ id: 1 }, { unique: true, name: 'container_id_index' });
// 2. Port index - frequently used for container lookups
containerSchema.index({ port: 1 }, { unique: true, name: 'port_index' });
// 3. Email index - for finding all containers by user email
containerSchema.index({ email: 1 }, { name: 'email_index' });
// 4. Name index - for searching containers by name
containerSchema.index({ name: 1 }, { name: 'name_index' });
// 5. Compound index for template-based and user container management
containerSchema.index({ template: 1, email: 1 }, { name: 'template_email_index' });

const getContainerByPort = async (port) => {
    const status = await Container.exists({ port: port })
    if (status) {
        const container = await Container.findOne({ port: port });
        return container;
    } else {
        return null;
    }
}

const getContainerById = async (id) => {
    // Replacing two sequential queries with a single query
    // This directly returns the container or null if not found
    return await Container.findOne({ id: id });
}

const getContainersByEmail = async (email) => {
    try {
        const containers = await Container.find({ email: email });
        return containers;
    } catch (err) {
        console.log(err);
        return null;
    }

}

const createNewContainer = async (email, userId, id, name, port, image, secondaryPort) => {
    try {
        const date = new Date().toISOString();
        const newContainer = new Container({ 
            email: email, 
            userId: userId, 
            id: id, 
            name: name, 
            port: port, 
            secondaryPort: secondaryPort,
            createdAt: date, 
            lastUsed: date, 
            template: image, 
            startedAt: date 
        });
        await newContainer.save();
        return true
    } catch (err) {
        console.log(err);
        return false
    }
}

const allContainers = async () => {
    try {
        const containers = await Container.find();
        return containers;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const deleteOneContainer = async (id) => {
    try {
        await Container.deleteOne({ id: id });
    } catch (err) {
        console.log(err);
        return null;
    }
}

const setStartedAt = async (id) => {
    try {
        await Container.updateOne({ id: id }, { $set: { startedAt: Date.now() } });
    } catch (err) {
        console.log(err);
    }
}

const Container = mongoose.model('Container', containerSchema);

exports.containerModel = Container;
exports.getContainerById = getContainerById;
exports.getContainerByPort = getContainerByPort;
exports.getContainersByEmail = getContainersByEmail;
exports.createNewContainer = createNewContainer;
exports.allContainers = allContainers;
exports.deleteOneContainer = deleteOneContainer; 
exports.setStartedAt = setStartedAt;