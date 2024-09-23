const jwt = require('jsonwebtoken');
const { checkRecords } = require('../models/auth')

const isAuthenticated = async (req, res, next) => {
    if (req.method == "OPTIONS") {
        res.status(200);
        return res.send();
    }
    return next();    // Bypass the Authentication step
    try {
        let token;
        token = req.headers.authorization?.split(' ')[1];
        console.log(token)
        if (token) {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const result = await checkRecords(payload.email, token);
            req.userData = payload;
            next();
        } else {
            res.status(401);
            res.send();
        }
    } catch (err) {
        console.log(err);
        res.status(401);
        res.send()
    }



}

exports.isAuth = isAuthenticated;