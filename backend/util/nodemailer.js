const nodemailer = require('nodemailer');
const { v4 } = require('uuid')

const auth = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: "codeterminusofficial@gmail.com",
        pass: process.env.NODEMAILER_PASS
    }
})

const generateOtp = () => {
    let ans = "";
    for (let i = 0; i < 5; ++i) {
        const num = Math.floor((Math.random() * 10000) % 10);
        ans = ans + num;
        console.log(num, ans);
    }
    return ans;
}

const generateUserId = () => {
    let str = v4();
    str = parseInt(str.replace('/-/g', ''), 16);
    console.log(str);
    return str;
}

const generateId = () => {
    let str = v4();
    str = parseInt(str.replace('/-/g', ''), 16);
    console.log(str);
    return str;
}

exports.authTransport = auth;
exports.generateOtp = generateOtp;
exports.generateUserId = generateUserId;
exports.generateId = generateId;


