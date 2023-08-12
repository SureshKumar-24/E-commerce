const User = require('../Model/user_model');
const Product = require('../Model/product_model');
const Cart = require('../Model/cart_model');
const Coupon = require('../Model/coupon_model');
const { validationResult } = require("express-validator");
const authService = require('../Services/user_auth');
const JWT = require('jsonwebtoken');
require("dotenv").config();
const validateMongodbId = require('../Helpers/verify_mongoId');
const asynchandler = require('express-async-handler');
const cart_model = require('../Model/cart_model');

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
        const id = req.user.id;
        const password = req.body.password;
        validateMongodbId(id);
        try {
            const updatepassword = await authService.updatePassword(id, password, res);
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
        const id = req.user.id;
        try {
            const UserUpdate = await authService.updateUser(id, name, address, res);
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
        const id = req.user.id;
        validateMongodbId(id);
        try {
            const deleteUser = await authService.deleteUser(id, res);
            return deleteUser;
        } catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    getWishlist: asynchandler(async (req, res) => {
        const id = req.user.id;
        validateMongodbId(id);
        try {
            const findUser = await User.findById(id).populate("wishlist");
            return res.status(200).json({ findUser });
        } catch (error) {
            throw new Error(error);
        }
    }),

    saveAddress: asynchandler(async (req, res) => {
        try {
            const id = req.user.id;
            validateMongodbId(id);
            const address = req.body.address;
            console.log('add', address)
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { address: address },
                { new: true }
            ).lean();
            return res.status(200).json({ msg: "Saved Address Successfully", updatedUser })
        } catch (error) {
            throw new Error(error);
        }
    }),

    userCart: asynchandler(async (req, res) => {
        const { cart } = req.body;
        console.log("cart", cart);
        const id = req.user.id;
        validateMongodbId(id);
        try {
            let products = [];
            const user = await User.findById(id);
            const alreadyExistCart = await Cart.findOne({ orderby: user._id });
            if (alreadyExistCart) {
                alreadyExistCart.remove();
            }
            for (let i = 0; i < cart.length; i++) {
                let object = {};
                object.product = cart[i]._id;
                object.count = cart[i].count;
                object.color = cart[i].color;
                const getprice = await Product.findById(cart[i]._id).select("price").exec();
                object.price = getprice.price;
                products.push(object);
            }

            let cartTotal = 0;
            for (let i = 0; i < products.length; i++) {
                cartTotal = cartTotal + products[i].price * products[i].count;
            }
            let newCart = await new Cart({
                products,
                cartTotal,
                orderby: user?._id,
            }).save();
            return res.status(200).json({ msg: "Cart Product add Successfully", newCart });
        } catch (error) {
            throw new Error(error);
        }
    }),

    usergetCart: asynchandler(async (req, res) => {
        const _id = req.user.id;
        validateMongodbId(_id);
        try {
            const getCart = await Cart.findOne({ orderby: _id }).populate("products.product");
            return res.status(200).json({ msg: "User cart detail get", getCart })

        } catch (error) {
            throw new Error(error);
        }
    }),

    userEmptyCart: asynchandler(async (req, res) => {
        const _id = req.user.id;
        validateMongodbId(_id);
        try {
            const user = await User.findById(_id);
            const emptycart = await Cart.findOneAndRemove({ orderby: user._id });
            return res.status(200).json({ msg: "Empty Cart", emptycart });
        } catch (error) {
            throw new Error(error);
        }
    }),

    userCoupon: asynchandler(async (req, res) => {
        const _id = req.user.id;
        validateMongodbId(_id);
        try {
            const { coupon } = req.body;
            console.log('coupon',coupon);
            const validcoupon = await Coupon.findOne({ name: coupon });
            console.log('validcoupon',validcoupon);
            const user = await User.findById(_id);
            if (validcoupon == null) {
                throw new Error("Invalid Coupon");
            }
            let { products, cartTotal } = await Cart.findOne({ orderby: user._id }).populate("products.product");
            let totalAfterDiscount = (cartTotal - (cartTotal * validcoupon.discount) / 100).toFixed(2);
            await Cart.findOneAndUpdate(
                { orderby: user._id },
                { totalAfterDiscount },
                { new: true }
            );
            return res.status(200).json({ msg: "Apply Coupon", totalAfterDiscount });
        } catch (error) {
            throw new Error(error);
        }
    }),

}