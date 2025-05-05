const { findUserByEmail, addUser } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userSignIn, logOut, checkRecords, storeOtp, verifyOtp } = require('../models/auth')
const { changePassword } = require('../models/user');
const { generateOtp, authTransport } = require('../util/nodemailer');

const signUp = async (req, res) => {
    //Server side validation
    let { email, username, password, confirmPassword } = req.body;
    email = email.trim().toLowerCase();
    const doc = await findUserByEmail(email);
    if (doc) {
        res.status(409);
        res.send();
    } else {
        try {
            const passcode = await bcrypt.hash(password, 12);
            const doc = await addUser(email, passcode, username, "user");
            res.status(200);
            res.send();
        }
        catch (err) {
            // console.log(err);
            res.status(500);
            res.send();
        }

    }
    // console.log(req.body);
}

const signIn = async (req, res) => {
    //Server side validation
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    const doc = await findUserByEmail(email);
    if (doc) {
        try {

            const bool = await bcrypt.compare(password, doc.password)
            if (bool) {
                const doc = await findUserByEmail(email);

                const userData = { userId: doc._id, email: doc.email, role: doc.role, email: doc.email };
                const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "30d" })
                const expiryDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30).toISOString();
                await userSignIn(email, { token: token, expiry: expiryDate })
                res.status(200).json({ token: token, expiry: expiryDate, role: doc.role, email: doc.email })

            } else {
                res.status(400);
                res.send();
            }

        }
        catch (err) {
            // console.log(err);
            res.status(500);
            res.send();
        }
    } else {
        res.status(400);
        res.send();


    }
    // console.log(req.body);
}

const signOut = async (req, res) => {
    try {
        let token;
        token = req.headers.authorization?.split(' ')[1];
        // console.log("put token", token)
        if (token) {

            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const result = await logOut(payload.email, token);
            res.status(200);
            res.send();
        } else {
            res.status(401);
            res.send();
        }
    } catch (err) {
        // console.log(err);
        res.status(401);
        res.send()
    }
}

const logIn = async (req, res) => {
    try {
        let token;
        token = req.headers.authorization?.split(' ')[1];
        // console.log(token)
        if (token) {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            try {
                const result = await checkRecords(payload.email, token);
            }
            catch (err) {
                // changed to get rid of the delete token from browser-error
                // console.log(err);
                res.status(401);
                return res.send();
            }
            res.status(200);
            res.send();
        } else {
            res.status(401);
            res.send();
        }
    } catch (err) {
        res.status(401);
        res.send()
    }
}

const changePass = async (req, res) => {
    try {
        const { email, newPassword, otp } = req.body;
        const result1 = await verifyOtp(email, otp);
        if (result1 === '500') {
            return res.status(500).json("failed");
        } else if (result1 === true) {
            console.log("correct otp");
        } else {
            return res.status(400).json("incorrect");
        }
        const passcode = await bcrypt.hash(newPassword, 12);
        const result = await changePassword(email, passcode);
        if (result) {
            res.status(200);
            res.send();
        } else {
            res.status(400);
            res.send();
        }

    } catch (err) {
        res.status(500);
        res.send();
    }
}

const sendOtp = async (req, res) => {
    let { email } = req.body;
    email = email.trim().toLowerCase();
    const doc = await findUserByEmail(email);
    if (doc) {
        const otp = generateOtp();
        const reciever = {
            from: "codeterminusofficial@gmail.com",
            to: email,
            subject: "OTP for Password Reset on CodeTerminus",
            text: `Welcome to CodeTerminus!!
Your One-Time Password (OTP) to reset your account password is:
${otp}`
        }
        authTransport.sendMail(reciever, async (err, emailRes) => {
            if (err) {
                console.log(err);
                res.status(409).json("email invalid");
            }
            else {
                console.log(emailRes);
                const storeRes = await storeOtp(email, otp);
                if (storeRes === '500') {
                    res.status(409).json("failed");
                }
                res.status(200).json({ otp: otp, email: email });
            }
        })
    } else {
        res.status(409).json("notfound");

    }
}

exports.signUp = signUp;
exports.signOut = signOut;
exports.signIn = signIn;
exports.logIn = logIn;
exports.changePass = changePass;
exports.sendOtp = sendOtp;