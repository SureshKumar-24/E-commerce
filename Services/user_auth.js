const User = require('../Model/user_model')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const JWT = require('jsonwebtoken');
const mongoose = require("mongoose");
const { refreshToken } = require('../config/refreshjwtoken');
const { generateToken } = require('../config/jwtgeneratetoken');
require("dotenv").config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nickm2878@gmail.com',
        pass: 'kdmgpvsgvcdqzica'
    }
});

module.exports.registerUser = async (email, password, name, address, mobile) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error('User with this email already exists');
    } else {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            address,
            mobile
        });

        await newUser.save();
        const token = JWT.sign({ email }, process.env.JWT_KEY, { expiresIn: '10m' });
        console.log('Token::', token);
        const emailContent = `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f1f1f1;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            
            h1 {
                text-align: center;
                color: #333;
            }
            
            p {
                margin-bottom: 20px;
                line-height: 1.5;
                color: #555;
            }
            
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background-color: #096D5B;
                color: #fff;
                text-decoration: none;
                border-radius: 4px;
            }
            
            .btn:hover {
                background-color: #fff;
                color: #096D5B;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Email Verification</h1>
            <p>Hello,</p>
            <p>Thank you for registering on our website. To complete your registration and access all the features, please click the button below to verify your email address:</p>
            <p><a class="btn" href="http://localhost:3000/verify/${token}">Verify Email Address</a></p>
            <p>If you did not create an account on our website, please ignore this email.</p>
            <p>Best regards,<br>Your Website Team</p>
        </div>
    </body>
    </html>
`;
        await transporter.sendMail({
            to: email,
            from: 'E-commerce <nickm2878@gmail.com>',
            subject: 'Verification Process',
            html: emailContent
        });

        return newUser;
    }
}

module.exports.verifyUser = async (token) => {
    const decoded = JWT.verify(token, process.env.JWT_KEY);
    if (decoded) {
        const data = await User.updateOne({ email: decoded.email }, { $set: { isEmailVerified: true }, new: true })
    }
    else {
        return false;
    }
}

module.exports.loginUser = async (email, password, res) => {
    const Userdata = await User.findOne({ email });

    if (Userdata) {
        if (Userdata.isEmailVerified == true) {
            const matchPassword = await bcrypt.compare(password, Userdata.password);
            if (!matchPassword) {
                return res.status(400).json({ msg: "Password doesn't match" });
            } else {
                const payload = {
                    id: Userdata._id,
                    email: Userdata.email
                }
                const refreshtoken = await refreshToken(payload);
                console.log('refreshtoken', refreshtoken);
                const UpdateUser = await User.findByIdAndUpdate(Userdata._id, {
                    refreshtoken: refreshtoken
                }, {
                    new: true
                });
                res.cookie("refreshtoken", refreshtoken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000
                })
                return res.status(200).json({
                    msg: "user Login Successfully",
                    _id: Userdata._id,
                    name: Userdata.name,
                    address: Userdata.address,
                    mobile: Userdata.mobile,
                    email: Userdata.email,
                    token: generateToken(payload)
                });
            }
        }
        else if (Userdata && Userdata.isEmailVerified == false) {
            const token = JWT.sign({ email }, process.env.JWT_KEY, { expiresIn: '10m' });
            const emailContent = `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f1f1f1;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            
            h1 {
                text-align: center;
                color: #333;
            }
            
            p {
                margin-bottom: 20px;
                line-height: 1.5;
                color: #555;
            }
            
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background-color: #096D5B;
                color: #fff;
                text-decoration: none;
                border-radius: 4px;
            }
            
            .btn:hover {
                background-color: #fff;
                color: #096D5B;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Email Verification</h1>
            <p>Hello,</p>
            <p>Thank you for registering on our website. To complete your registration and access all the features, please click the button below to verify your email address:</p>
            <p><a class="btn" href="http://localhost:3000/verify/${token}">Verify Email Address</a></p>
            <p>If you did not create an account on our website, please ignore this email.</p>
            <p>Best regards,<br>Your Website Team</p>
        </div>
    </body>
    </html>
`;
            await transporter.sendMail({
                to: email,
                from: 'E-commerce <nickm2878@gmail.com>',
                subject: 'Verification Process',
                html: emailContent
            });
            return res.status(400).json({ msg: "Email is sent for verification for the registered account" });
        } else {
            return false;
        }
    } else {
        return res.status(400).json({ msg: "User is not found" });
    }
}

module.exports.forgotUser = async (email, res) => {
    const userdata = await User.findOne({ email });

    if (!userdata) {
        return res.status(400).json({ success: false, msg: 'User not found with this email' });
    } else {
        const token = JWT.sign({ id: userdata._id, email: userdata.email }, process.env.JWT_KEY, { expiresIn: "10m" });
        const emailContent = `
                    <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f1f1f1;
                            }
                            
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #fff;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            
                            h1 {
                                text-align: center;
                                color: #333;
                            }
                            
                            p {
                                margin-bottom: 20px;
                                line-height: 1.5;
                                color: #555;
                            }
                            
                            .btn {
                                display: inline-block;
                                padding: 10px 20px;
                                background-color: #096D5B;
                                color: #fff;
                                text-decoration: none;
                                border-radius: 4px;
                            }
                            
                            .btn:hover {
                                background-color: #fff;
                                color: #096D5B;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Reset Password</h1>
                            <p>Hello,</p>
                            <p>Click on the button below to reset your password:</p>
                            <p><a class="btn" href="http://localhost:3000/reset-password/${token}">Reset Password</a></p>
                            <p>If you did not request a password reset, please ignore this email.</p>
                            <p>Best regards,<br>E-commerece</p>
                        </div>
                    </body>
                    </html>
                `;

        await transporter.sendMail({
            to: email,
            from: 'E-commerce <nickm2878@gmail.com>',
            subject: 'Reset Password',
            html: emailContent
        });

        return res.status(200).json({
            success: true,
            msg: "Forgot password link has been sent to your email",
        });
    }
}

module.exports.resetPassword = async (token, new_password, confirm_password, res) => {
    if (new_password == confirm_password) {
        var decoded = JWT.verify(token, process.env.JWT_KEY);
        if (decoded) {
            const userdata = await User.find({ email: decoded.email });
            if (userdata) {
                const hashPassword = await bcrypt.hash(new_password, 12);
                await User.updateOne({ email: decoded.email }, { $set: { password: hashPassword } });
            }
            return res.status(200).json({ success: true, msg: "Password reset Successfully" });
        }
        else {
            return res.status(400).json({ success: false, msg: "new_password & confirm_password not matched" });
        }
    }
}

module.exports.updateUser = async (_id, name, address, res) => {
    const updateUser = await User.findByIdAndUpdate(_id, {
        name: name,
        address: address
    }, {
        new: true
    }
    );
    return res.status(200).json({ msg: "User data Updated Successfully", updateUser });
}

module.exports.updatePassword = async (_id, password, res) => {
    const user = await User.findById(_id);
    const matchPassword = await bcrypt.compare(password, user.password);
    console.log('matchpassword', matchPassword);
    if (matchPassword) {
        return res.status(400).json({ msg: "Provide another password instead previous one" });
    } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const updatePassword = await User.updateOne({ _id }, { $set: { password: hashPassword } }, { new: true });
        return res.status(200).json({ msg: "Password Updated Successfully", updatePassword });
    }
}

module.exports.deleteUser = async (_id, res) => {
    const deleteUser = await User.findByIdAndDelete(_id);
    return res.status(200).json({ msg: "Delete User Successfully", deleteUser })
}
