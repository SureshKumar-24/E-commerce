const express = require('express');
const { body } = require('express-validator');
const admin = require('../Controllers/admin_controller');
const router = express.Router();
const Verifytoken = require('../Helpers/verify_token');

router.get('/alluser', Verifytoken.verify, Verifytoken.isAdmin, admin.allUser);
router.get('/user/:id', Verifytoken.verify, Verifytoken.isAdmin, admin.oneUser);

router.post('/block/:id', Verifytoken.verify, Verifytoken.isAdmin, admin.blockUser);
router.post('/unblock/:id', Verifytoken.verify, Verifytoken.isAdmin, admin.unblockUser);
module.exports = router;