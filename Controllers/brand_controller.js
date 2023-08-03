const Brand = require('../Model/brand_model');
const asynchandler = require('express-async-handler');
const validateMongodbId = require('../Helpers/verify_mongoId');

module.exports = {
    createBrand: asynchandler(async (req, res, next) => {
        try {
            const createBrand = await Brand.create(req.body);
            return res.status(201).json({ msg: "Brand created Successfully", Brand: createBrand });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    updateBrand: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const updateBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(201).json({ msg: "Brand Update Successfully", Brand: updateBrand });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    getBrand: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const getBrand = await Brand.findById(id);
            return res.status(201).json({ msg: "Brand data get Successfully", Brand: getBrand });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    getallBrand: asynchandler(async (req, res, next) => {
        try {
            const getallBrand = await Brand.find();
            return res.status(201).json({ msg: "Brand all data Successfully", Brand: getallBrand });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    deleteBrand: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const deleteBrand = await Brand.findByIdAndDelete(id);
            if (deleteBrand == null) {
                return res.status(201).json({ msg: "Brand doesn't exist" });
            } else {
                return res.status(201).json({ msg: "Brand Delete Successfully", Brand: deleteBrand });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),
}