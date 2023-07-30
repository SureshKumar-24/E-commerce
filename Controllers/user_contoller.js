const User = require('../Model/user_model');
const { validationResult } = require("express-validator");
const authService = require('../Services/user_auth');
const { verify } = require('jsonwebtoken');
const JWT = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    register: async (req, res, next) => {
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
    },

    verify: async (req, res, next) => {
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
    },

    login: async (req, res, next) => {
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
    },

    forgot: async (req, res, next) => {
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
    },

    getresetpassword: async (req, res, next) => {
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
    },

    resetpassword: async (req, res, next) => {
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
    },

    updateUser: async (req, res, next) => {
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
    },

    deleteUser: async (req, res, next) => {
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
    }

}