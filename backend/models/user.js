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
    },
    assignedTemplates: {
        type: 'Array',
        required: false,
    },
    billingInfo: {
        amount: {
            type: 'Number',
            default: 0,
        },
        monthlyBills: [{
            month: {
                type: 'String',
                required: true
            },
            year: {
                type: 'Number',
                required: true
            },
            amount: {
                type: 'Number',
                required: true
            }
        }]
    },
    containerUsage: {
        totalContainers: {
            type: 'Number',
            default: 0,
        },
        monthlyUsage: [{
            month: {
                type: 'String',
                required: true
            },
            year: {
                type: 'Number',
                required: true
            },
            imageNames: [{
                type: 'String',
                required: true
            }]
        }]
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
        // console.log(res);
        return res;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function billIncrement(email, amount) {
    try {
        const user = await User.findOne({ email: email });
        if(!user){
            throw new Error("User not found");
        }

        // Get current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
        const currentYear = currentDate.getFullYear();

        // Update total amount
        user.billingInfo.amount += amount;

        // Check if a bill for current month exists
        const existingBillIndex = user.billingInfo.monthlyBills.findIndex(
            bill => bill.month === currentMonth && bill.year === currentYear
        );

        if (existingBillIndex !== -1) {
            // Update existing monthly bill
            user.billingInfo.monthlyBills[existingBillIndex].amount += amount;
        } else {
            // Add new monthly bill
            user.billingInfo.monthlyBills.push({
                month: currentMonth,
                year: currentYear,
                amount: amount
            });
        }

        await user.save();
        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function containerUsageIncrement(email, templateName) {
    try {
        const user = await User.findOne({ email: email });
        if(!user){
            throw new Error("User not found");
        }
        user.containerUsage.totalContainers += 1;
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
        const currentYear = currentDate.getFullYear();

        if(!user.containerUsage.monthlyUsage.find(usage => usage.month === currentMonth && usage.year === currentYear)){
            user.containerUsage.monthlyUsage.push({
                month: currentMonth,
                year: currentYear,
                imageNames: [templateName]
            });
        }
        else{
            user.containerUsage.monthlyUsage.find(usage => usage.month === currentMonth && usage.year === currentYear).imageNames.push(templateName);
        }

        await user.save();
        return user;
    } catch (err) {
        console.error(err);
        throw err;
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
            // console.log("User not found");
            return null;
        }
        if(user.role == 'admin'){
            // console.log("Cannot change role of admin");
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

async function addtemplate(email, templateId) {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.assignedTemplates.includes(templateId)) {
            throw new Error("Template already assigned to the user");
        }
        user.assignedTemplates.push(templateId);
        await user.save();
        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function removetemplate(email, templateId) {
    try {
        const user = await User.findOne({ email: email });
        if(!user){
            throw new Error("User not found");
        }
        if(!user.assignedTemplates.includes(templateId)){
            throw new Error("Template not assigned to the user");
        }
        user.assignedTemplates = user.assignedTemplates.filter(id => id.toString() !== templateId.toString()); // 
        await user.save();
        return user;
    } catch (err) {
        console.error(err);
        throw err;
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
exports.addtemplate = addtemplate;
exports.removetemplate = removetemplate;
exports.billIncrement = billIncrement;
exports.containerUsageIncrement = containerUsageIncrement;