const mongoose = require('mongoose');

const containerHistorySchema = new mongoose.Schema({
    containerName: {
        type:  String,
    }, 
    containerId: {
        type: String,
    },
    port: {
        type: Number,
    },
    createdAt: {
        type: Date,
    },
    deletedAt: {
        type: Date,
    },
    userName: {
        type: String,
    },
    email: {
        type: String,
    },
    template: {
        type: String,
    }
})

const ContainerHistory = mongoose.model('ContainerHistory', containerHistorySchema);

const addContainerHistory = async (containerName, containerId, port, createdAt, deletedAt, userName, email, template) => {
    try {
        const containerHistory = new ContainerHistory({containerName, containerId, port, createdAt, deletedAt, userName, email, template});
        await containerHistory.save();
        return true;
    } catch (error) {
        console.error('Error adding container history:', error);
        return false;
    }
}

const getAllContainerHistory = async () => {
    try {
        const containerHistory = await ContainerHistory.find();
        return containerHistory;
    } catch (error) {
        console.error('Error getting all container history:', error);
        return [];
    }
}


module.exports = {
    addContainerHistory,
    getAllContainerHistory,
}