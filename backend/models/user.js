const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: 'String', 
        required: true
    },
    email: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
        required: true
   },
    bio : {
        type: 'String',
        required: false
    },
    profilePic: {
        type: 'String',
        required: false
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
async function editUser(email, username, bio, profilePic) {
    try {
        const user = await User.findOne({ email: email });
        user.username = username;
        user.bio = bio;
        user.profilePic = profilePic;
        await user.save();
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
// getting user by email by a function  in json format
async function getUserByEmail(email) {
    const user = await User.findOne({ email: email });
    return user;
}


const User = mongoose.model('User', userSchema);


exports.userModel = User;
exports.findUserByEmail = findUserByEmail;
exports.addUser = addUser;
exports.editUser = editUser;
exports.getUserByEmail = getUserByEmail;
