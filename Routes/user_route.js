const express = require('express');
const { body } = require('express-validator');
const User = require('../Controllers/user_contoller');
const router = express.Router();

const registerValidationRules = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('name').notEmpty().isString().withMessage('Name is required'),
    body('address').notEmpty().isString().withMessage('Address is required'),
    body('mobile').notEmpty().isString().withMessage('Mobile number is required'),
    body('password', 'Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number').notEmpty().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
]

router.post('/register', registerValidationRules, User.register);
module.exports = router;