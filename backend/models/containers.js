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
    },
    template: {
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
    try {
        const containers = await Container.find({ email: email });
        return containers;
    } catch (err) {
        console.log(err);
        return null;
    }

}

const createNewContainer = async (email, userId, id, name, port, image) => {
    try {
        const date = new Date().toISOString();
        const newContainer = new Container({ email: email, userId: userId, id: id, name: name, port: port, createdAt: date, lastUsed: date, template: image });
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




const Container = mongoose.model('Container', containerSchema);


exports.containerModel = Container;
exports.getContainerById = getContainerById;
exports.getContainerByPort = getContainerByPort;
exports.getContainersByEmail = getContainersByEmail;
exports.createNewContainer = createNewContainer;
exports.allContainers = allContainers;
exports.deleteOneContainer = deleteOneContainer; 
