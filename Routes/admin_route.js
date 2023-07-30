const express = require('express');
const { body } = require('express-validator');
const admin = require('../Controllers/admin_controller');
const router = express.Router();
const Verfiytoken = require('../Helpers/verify_token');

router.get('/alluser', Verfiytoken.verify, Verfiytoken.isAdmin, admin.allUser);
router.get('/user/:id', Verfiytoken.verify, Verfiytoken.isAdmin, admin.oneUser);

router.post('/block/:id', Verfiytoken.verify, Verfiytoken.isAdmin, admin.blockUser);
router.post('/unblock/:id', Verfiytoken.verify, Verfiytoken.isAdmin, admin.unblockUser);
module.exports = router;