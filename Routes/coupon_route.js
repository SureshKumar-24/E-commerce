const express = require('express');
const Coupon = require('../Controllers/coupon_controller');
const router = express.Router();
const Verifytoken = require('../Helpers/verify_token');

router.post('/coupon', Verifytoken.verify, Verifytoken.isAdmin, Coupon.createCoupon);
router.get('/coupon/all', Verifytoken.verify, Coupon.getallcoupon);
router.post('/coupon/:id', Verifytoken.verify, Verifytoken.isAdmin, Coupon.updateCoupon);
router.delete('/coupon/delete/:id',Verifytoken.verify,Verifytoken.isAdmin,Coupon.deleteCoupon);
module.exports = router;