const Coupon = require('../Model/coupon_model');
const asynchandler = require('express-async-handler');
const validateMongodbId = require('../Helpers/verify_mongoId');

module.exports = {
    createCoupon: asynchandler(async (req, res, next) => {
        try {
            const newCoupon = await Coupon.create(req.body);
            return res.status(201).json({ msg: "Coupon Created Successfully", Coupon: newCoupon });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    getallcoupon: asynchandler(async (req, res, next) => {
        try {
            const allcoupon = await Coupon.find();
            return res.status(201).json({ msg: "Coupon get Successfully", Coupon: allcoupon });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    updateCoupon: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(201).json({ msg: "Blog Update  Successfully", Blog: updateCoupon });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    deleteCoupon: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const deletecoupon = await Coupon.findByIdAndDelete(id);
            if (deletecoupon == null) {
                return res.status(201).json({ msg: "coupon doesn't exist" });
            } else {
                return res.status(201).json({ msg: "coupon Delete Successfully", Coupon: deletecoupon });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),
}
