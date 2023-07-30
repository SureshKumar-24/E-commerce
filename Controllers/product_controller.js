const Product = require('../Model/product_model');
const { validationResult } = require("express-validator");
const validateMongodbId = require('../Helpers/verify_mongoId');
const productservices = require('../Services/product');
const slugify = require('slugify');
module.exports = {
    createProduct: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            if (req.body.title) {
                req.body.slug = slugify(req.body.title);
            }
            const newProduct = await Product.create(req.body);
            return res.status(201).json({ msg: "Product Add Successfully", Product: newProduct });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    },

    getProduct: async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const getProduct = await Product.findById(id);
            return res.status(201).json({ msg: "Product data get Successfully", Product: getProduct });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    },

    getallProduct: async (req, res, next) => {
        try {
            const getallProduct = await Product.find();
            return res.status(201).json({ msg: "Product data get Successfully", Product: getallProduct });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    },

    productUpdate: async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        try {
            const updateproduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(201).json({ msg: "Product Update  Successfully", Product: updateproduct });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    },

    deleteUpdate: async (req, res, next) => {
        const id = req.params.id;
        try {
            const deleteproduct = await Product.findByIdAndDelete(id);
            return res.status(201).json({ msg: "Product Delete Successfully", Product: deleteproduct });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    },

}

