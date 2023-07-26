const User = require('../Model/user_model');
const { validationResult } = require("express-validator");
const authService = require('../Services/user_auth');

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
    }
    
}