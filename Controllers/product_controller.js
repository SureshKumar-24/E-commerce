const Product = require('../Model/product_model');
const { validationResult } = require("express-validator");
const validateMongodbId = require('../Helpers/verify_mongoId');
const asynchandler = require('express-async-handler');
const slugify = require('slugify');
module.exports = {
    createProduct: asynchandler(async (req, res, next) => {
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
    }),

    getProduct: asynchandler(async (req, res, next) => {
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
    }),

    getallProduct: asynchandler(async (req, res, next) => {
        try {
            //Filtering 
            const queryObj = { ...req.query };
            const excludeFields = ["page", "sort", "limit", "fields"];
            excludeFields.forEach((el) => delete queryObj[el]);
            console.log(queryObj);

            let queryStr = JSON.stringify(queryObj);
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
            // const getallProduct = await Product.where('category').equals(req.query.category);
            // const getallProduct = await Product.find(queryObj);
            let query = Product.find(JSON.parse(queryStr));
            //Sorting 

            if (req.query.sort) {
                const sortBy = req.query.sort.split(',').join(" ");
                query = query.sort(sortBy);
                console.log('sortby', query);
            } else {
                query = query.sort('-createdAt');
                console.log('sort', query);
            }

            //limits
            if (req.query.fields) {
                const fields = req.query.fields.split(',').join(" ");
                query = query.select(fields);
                console.log('sortby', query);
            } else {
                query = query.select('-__v');
                console.log('sort', query);
            }

            //Pagination 
            const page = req.query.page;
            const limit = req.query.limit;
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);

            if (req.query.page) {
                const productcount = await Product.countDocuments();
                if (skip >= productcount) throw new Error(`This page dosn't exist `)
            }
            const getallProduct = await query;
            return res.status(201).json({ msg: "Product data get Successfully", Product: getallProduct });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    productUpdate: asynchandler(async (req, res, next) => {
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
    }),

    deleteUpdate: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        try {
            const deleteproduct = await Product.findByIdAndDelete(id);
            return res.status(201).json({ msg: "Product Delete Successfully", Product: deleteproduct });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

}

