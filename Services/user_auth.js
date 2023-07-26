const User = require('../Model/user_model')
const bcrypt = require('bcrypt');

module.exports.registerUser = async (email, password, name, address, mobile) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error('User with this email already exists');
    }

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

    return newUser;
}
