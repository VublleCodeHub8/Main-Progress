const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: 'String',
    },
    email: {
        type: 'String',
    },
    password: {
        type: 'String'
    }
})

async function findUserByEmail(email) {
    const res = await User.exists({ email: email });
    if (res) {
        const doc = await User.findById(res);
        return doc;
    }
    return null;
}
async function addUser(email, password, username) {
    try {
        const newUser = new User({ email: email, password: password, username: username });
        await newUser.save();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const User = mongoose.model('User', userSchema);


exports.userModel = User;
exports.findUserByEmail = findUserByEmail;
exports.addUser = addUser;
