const BlogCategory = require('../Model/blogcategory_model');
const asynchandler = require('express-async-handler');
const validateMongodbId = require('../Helpers/verify_mongoId');

module.exports = {
    createCategory: asynchandler(async (req, res, next) => {
        try {
            const createcategory = await BlogCategory.create(req.body);
            return res.status(201).json({ msg: "Category created Successfully", Category: createcategory });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    updateCategory: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const updateCategory = await BlogCategory.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(201).json({ msg: "Category Update Successfully", Category: updateCategory });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    getCategory: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const getCategory = await BlogCategory.findById(id);
            return res.status(201).json({ msg: "Category data get Successfully", Category: getCategory });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    getallCategory: asynchandler(async (req, res, next) => {
        try {
            const getallCategory = await BlogCategory.find();
            return res.status(201).json({ msg: "Category all data Successfully", Category: getallCategory });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    deleteCategory: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const deleteCategory = await BlogCategory.findByIdAndDelete(id);
            if (deleteCategory == null) {
                return res.status(201).json({ msg: "Category doesn't exist" });
            } else {
                return res.status(201).json({ msg: "Category Delete Successfully", Category: deleteCategory });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),
}