const mongoose = require('mongoose');


const connectToDB = async () => {
    try {
        const str = process.env.CONNECTION_STR;
        await mongoose.connect(str);
    } catch (error) {
        throw error;
    }
}

exports.connectToDB = connectToDB;