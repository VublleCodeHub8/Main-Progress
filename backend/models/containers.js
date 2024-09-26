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
    }

});

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
    const status = await Container.exists({ id: id })
    if (status) {
        const container = await Container.findOne({ id: id });
        return container;
    } else {
        return null;
    }
}

const getContainersByEmail = async (email) => {

    const containers = await Container.find({ emai: email });
    return containers;

}

const createNewContainer = async (email, userId, id, name, port) => {
    try {
        const date = new Date().toISOString();
        const newContainer = new Container({ email: email, userId: userId, id: id, name: name, port: port, createdAt: date, lastUsed: date });
        await newContainer.save();
        return true
    } catch (err) {
        console.log(err);
        return false
    }
}



const Container = mongoose.model('Container', containerSchema);


exports.containerModel = Container;
exports.getContainerById = getContainerById;
exports.getContainerByPort = getContainerByPort;
exports.getContainersByEmail = getContainersByEmail;
exports.createNewContainer = createNewContainer;

