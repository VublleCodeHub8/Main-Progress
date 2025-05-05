const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    token: String,
    expiry: String
})

const authSchema = mongoose.Schema({
    email: {
        type: String,
    },
    loginTokens: {
        type: [{ token: String, expiry: String }]
    }
})

async function findAuthByEmail(email) {
    const res = await Auth.exists({ email: email });
    if (res) {
        const doc = await Auth.findById(res);
        return doc;
    }
    return null;
}
async function pushToken(email, token) {
    try {
        const existingEntry = await findAuthByEmail(email);
        if (!existingEntry) {
            return null;
        } else {
            const newToken = JSON.parse(JSON.stringify(existingEntry.loginTokens));
            newToken.push({ token: token.token, expiry: token.expiry });
            const res = await Auth.updateOne({ email: email }, { loginTokens: newToken });
            return true;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}
async function addUserLogin(email, token) {
    try {
        const newUser = new Auth({ email: email, loginTokens: [{ token: token.token, expiry: token.expiry }] });
        await newUser.save();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function userSignIn(email, token) {
    try {
        const preExisting = await findAuthByEmail(email);
        if (preExisting) {
            await pushToken(email, token);
        } else {
            await addUserLogin(email, token)
        }
    } catch (err) {
        console.log(err);
        throw (err)
    }
}

async function logOut(email, token) {
    try {
        const preExisting = await findAuthByEmail(email);
        if (!preExisting) {
            return true;
        }
        const newTokens = preExisting.loginTokens.filter((tok) => {
            if (tok.token === token) {
                return 0;
            }
            return 1;
        })
        const res = await Auth.updateOne({ email: email }, { loginTokens: newTokens });
        return true;
    } catch (err) {
        console.log(err);
        throw (err)
    }
}

async function checkRecords(email, token) {
    try {
        const preExisting = await findAuthByEmail(email);
        if (!preExisting) {
            throw "Token Not Found";
        }
        let status = false;
        for (let i of preExisting.loginTokens) {
            if (i.token === token) {
                status = true;
                break;
            }
        }
        if (!status) {
            throw "Token Not Found"
        }
        return true;
    } catch (err) {
        console.log(err);
        throw (err)
    }
}

async function allAuth() {
    try {
        const data = await Auth.find();
        const newData = [];
        for (let i of data) {
            newData.push({ email: i.email, noOfLogins: i.loginTokens.length });
        }
        return newData;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// function to logout user by deleting the all token
async function deleteToken(email) {
    try {
        const preExisting = await findAuthByEmail(email);
        if (!preExisting) {
            return true;
        }
        const res = await Auth.updateOne({ email: email }, { loginTokens: [] });
        return true;
    } catch (err) {
        console.log(err);
        throw (err)
    }
}

const Auth = mongoose.model('Auth', authSchema);


const otpSchema = mongoose.Schema({
    email: {
        type: 'String',
    },
    otp: {
        type: 'Number'
    },
})

async function storeOtp(email, otp) {
    try {
        const doc = await Otp.exists({ email: email });
        if (doc) {
            await Otp.updateOne({ email: email }, { $set: { otp: otp } });
        } else {
            const newEntry = new Otp({ email: email, otp: otp });
            await newEntry.save()
        }
        return '200';
    } catch (err) {
        console.log(err);
        return '500';
    }
}

async function verifyOtp(email, otp) {
    try {
        const doc = await Otp.findOne({ email: email });
        if (doc && doc.otp == otp) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return '500';
    }
}

const Otp = mongoose.model('Otp', otpSchema);


exports.otpModel = Otp;
exports.storeOtp = storeOtp;
exports.verifyOtp = verifyOtp;


exports.authModel = Auth;
exports.findAuthByEmail = findAuthByEmail;
exports.addUserLogin = addUserLogin;
exports.pushToken = pushToken;
exports.userSignIn = userSignIn;
exports.logOut = logOut;
exports.checkRecords = checkRecords;
exports.allAuth = allAuth;
exports.deleteToken = deleteToken;