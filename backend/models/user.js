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
        data : Buffer,
        contentType: String,
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

async function editUser(email, username, bio, file) {
    try {
        const updateData = {
            username: username,
            bio: bio,
        };

        
        if (file) {
            updateData.profilePic = {
                data: file.buffer,
                contentType: file.mimetype,
            };
        }

        const result = await User.updateOne(
            { email: email },
            { $set: updateData },
            { new: true } 
        );
        return result;
    } catch (err) {
        console.error(err);
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
        
        // Toggle the role based on current role
        const newRole = user.role === 'user' ? 'dev' : 'user';
        
        // Update the role in the database
        const result = await User.updateOne({ email: email }, { $set: { role: newRole } });
        
        // if (result.modifiedCount === 1) {
        //     console.log(`Role updated successfully to ${newRole}`);
        // } else {
        //     console.log("Failed to update role");
        // }
        
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

