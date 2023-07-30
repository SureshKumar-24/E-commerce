const User = require('../Model/user_model')
const mongoose = require("mongoose");

module.exports.allUser = async (res) => {
    const Userall = await User.find({ role: 'user' });
    return res.status(200).json({ msg: "User data get successfully", Userall });
}

module.exports.getUser = async (user_id, res) => {
    const getUser = await User.findById(user_id);
    return res.status(200).json({ msg: "User data get successfully", getUser });
}