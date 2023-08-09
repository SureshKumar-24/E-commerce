const User = require('../Model/user_model');
const { validationResult } = require("express-validator");
const authService = require('../Services/user_auth');
const { verify } = require('jsonwebtoken');
const JWT = require('jsonwebtoken');
require("dotenv").config();
const validateMongodbId = require('../Helpers/verify_mongoId');
const asynchandler = require('express-async-handler');

module.exports = {
    register: asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { email, password, name, address, mobile } = req.body;
        try {
            const newUser = await authService.registerUser(email, password, name, address, mobile);
            return res.status(201).json({ message: 'Registration successful!', user: newUser });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    verify: asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { token } = req.params;
        try {
            const verifydata = await authService.verifyUser(token);
            const decoded = JWT.verify(token, process.env.JWT_KEY);
            return res.render('../views/admin/verify', { email: decoded.email });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    login: asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            const User = await authService.loginUser(email, password, res);
            return User;
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    loginadmin: asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            const Admin = await authService.loginAdmin(email, password, res);
            return Admin;
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    forgot: asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { email } = req.body;
        try {
            const Userforgot = await authService.forgotUser(email, res);
            return Userforgot;
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    getresetpassword: asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { token } = req.params;
        try {
            var decoded = JWT.verify(token, process.env.JWT_KEY);
            return res.render('../views/admin/reset-password', { email: decoded.email });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    resetpassword: asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { new_password, confirm_password } = req.body;
        const { token } = req.params;
        try {
            const resetuserpassword = await authService.resetPassword(token, new_password, confirm_password, res);
            return resetuserpassword;
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),
    updatePassword: asynchandler(async (req, res, next) => {
        const _id = req.user.id;
        const password = req.body.password;
        validateMongodbId(_id);
        try {
            const updatepassword = await authService.updatePassword(_id, password, res);
            return updatepassword;
        } catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    updateUser: asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const name = req?.body?.name;
        const address = req?.body?.address;
        const _id = req.user.id;
        try {
            const UserUpdate = await authService.updateUser(_id, name, address, res);
            return UserUpdate;
        } catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    deleteUser: asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const _id = req.user.id;
        try {
            const deleteUser = await authService.deleteUser(_id, res);
            return deleteUser;
        } catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    getWishlist: asynchandler(async (req, res) => {
        const _id = req.user.id;
        try {
            console.log('id', _id);
            const findUser = await User.findById(_id).populate("wishlist");
            return res.status(200).json({ findUser });
        } catch (error) {
            throw new Error(error);
        }
    })

}