const express = require('express');
const { body } = require('express-validator');
const User = require('../Controllers/user_contoller');
const router = express.Router();
const Verifytoken = require('../Helpers/verify_token');

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
router.get('/verify/:token', User.verify);

router.post('/login', User.login);
router.post('/admin/login', User.loginadmin);
router.post('/forgot', User.forgot);

router.get('/reset-password/:token', User.getresetpassword);
router.post('/reset-password/:token', User.resetpassword);
router.get('/getwishlist', Verifytoken.verify, User.getWishlist);
router.post('/update', Verifytoken.verify, User.updateUser);
router.post('/password', Verifytoken.verify, User.updatePassword);
router.delete('/delete', Verifytoken.verify, User.deleteUser);
module.exports = router;