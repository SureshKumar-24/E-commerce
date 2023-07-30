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

module.exports.userBlocked = async (user_id, res) => {
    const user = await User.findById(user_id);
    if (user && user.isBlocked) {
        return res.status(200).json({ msg: "User is already blocked", user });
    }

    const blockuser = await User.findByIdAndUpdate(user_id, {
        isBlocked: true
    }, {
        new: true
    }
    );
    return res.status(200).json({ msg: "User Blocked successfully", blockuser });
}

module.exports.userUnblocked = async (user_id, res) => {
    const user = await User.findById(user_id);
    if (user && !user.isBlocked) {
        return res.status(200).json({ msg: "User is already unblocked", user });
    }

    const unblockuser = await User.findByIdAndUpdate(user_id, {
        isBlocked: false
    }, {
        new: true
    }
    );
    return res.status(200).json({ msg: "User Unblocked successfully", unblockuser });
}