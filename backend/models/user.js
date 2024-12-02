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
    },
    bio: {
        type: 'String',
        required: false
    },
    profilePic: {
        type: 'String',
        required: false
    },
    role: {
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

async function addUser(email, password, username, role) {
    try {
        const newUser = new User({ email: email, password: password, username: username, role: role });
        await newUser.save();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function allUsers() {
    try {
        const res = await User.find();
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function editUser(email, username, bio, profilePic) {
    try {
        const result = await User.updateOne(
            { email: email },
            {
                $set: {
                    username: username,
                    bio: bio,
                    profilePic: profilePic
                }
            }
        )
        return true;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email: email });
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function changeRole(email) {
    try {
        // Find the user by email
        const user = await User.findOne({ email: email });
        
        if (!user) {
            console.log("User not found");
            return null;
        }
        if(user.role == 'admin'){
            console.log("Cannot change role of admin");
            return null;
        }
        const newRole = user.role === 'user' ? 'dev' : 'user';
        const result = await User.updateOne({ email: email }, { $set: { role: newRole } });
        return result;
    } catch (err) {
        console.log("Error:", err);
        return null;
    }
}


const User = mongoose.model('User', userSchema);


exports.userModel = User;
exports.findUserByEmail = findUserByEmail;
exports.addUser = addUser;
exports.allUsers = allUsers;
exports.editUser = editUser;
exports.getUserByEmail = getUserByEmail;
exports.changeRole = changeRole;
