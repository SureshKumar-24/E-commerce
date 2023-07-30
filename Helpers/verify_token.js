const jwt = require('jsonwebtoken');
const User = require('../Model/user_model');
const mongoose = require("mongoose");
require("dotenv").config();

module.exports.verify = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    try {
        if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ');
            const token = bearerToken[1];
            jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
                if (err) {
                    return res.send('Token is not Valid');
                }
                req.user = payload.payload;
                console.log(req.user);
                next();
            })
        }
    }
    catch (error) {
        res.status(400).json({
            message: 'Token is not passing'
        })
    }
}

module.exports.isAdmin = async (req, res, next) => {
    const email = req.user.email;
    console.log('isAdmin email', email);
    try {
        const admin = await User.findOne({ email, role: 'admin' });
        if (!admin) {
            return res.status(200).json({ msg: "You are not admin " });
        }
        else {
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
};