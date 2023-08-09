const Blog = require('../Model/blog_model');
const asynchandler = require('express-async-handler');
const validateMongodbId = require('../Helpers/verify_mongoId');
const cloudinaryUpload = require('../Helpers/cloudinary');
const fs= require('fs');

module.exports = {
    createBlog: asynchandler(async (req, res, next) => {
        try {
            const newBlog = await Blog.create(req.body);
            return res.status(201).json({ msg: "Blog Add Successfully", Blog: newBlog });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    updateBlog: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        console.log('upateBlog', id);
        validateMongodbId(id);
        try {
            const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(201).json({ msg: "Blog Update  Successfully", Blog: updateBlog });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    getBlog: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
            const updateViews = await Blog.findByIdAndUpdate(id, {
                $inc: { numViews: 1 },
            }, {
                new: true
            }
            );
            return res.status(201).json({ msg: "Blog data get Successfully", Blog: getBlog });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    getAllBlog: asynchandler(async (req, res, next) => {
        try {
            const getallBlog = await Blog.find();
            return res.status(201).json({ msg: "All Blog get Successfully", Blog: getallBlog });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    deleteBlog: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const deleteblog = await Blog.findByIdAndDelete(id);
            if (deleteblog == null) {
                return res.status(201).json({ msg: "Blog doesn't exist" });
            } else {
                return res.status(201).json({ msg: "Blog Delete Successfully", Blog: deleteblog });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    likeBlog: asynchandler(async (req, res, next) => {
        try {
            const { blogId } = req.body;
            validateMongodbId(blogId);
            const blog = await Blog.findById(blogId);
            const loginUserId = req?.user?.id;
            const isLiked = blog?.isLiked;
            const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString());
            if (alreadyDisliked) {
                const blog = await Blog.findByIdAndUpdate(blogId, {
                    $pull: { dislikes: loginUserId },
                    isDisliked: false,
                }, {
                    new: true
                });
                return res.status(201).json({ msg: "", Blog: blog });
            }
            if (isLiked) {
                const blog = await Blog.findByIdAndUpdate(blogId, {
                    $pull: { dislikes: loginUserId },
                    isLiked: false,
                }, {
                    new: true
                });
                return res.status(201).json({ msg: "", Blog: blog });
            } else {
                const blog = await Blog.findByIdAndUpdate(blogId, {
                    $push: { likes: loginUserId },
                    isLiked: true,
                }, {
                    new: true
                });
                return res.status(201).json({ msg: "", Blog: blog });
            }

        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

    dislikeBlog: asynchandler(async (req, res, next) => {
        try {
            const { blogId } = req.body;
            validateMongodbId(blogId);
            const blog = await Blog.findById(blogId);
            const loginUserId = req?.user?.id;
            const isDisliked = blog?.isDisliked;
            const alreadyLiked = blog?.likes?.find((userId) => userId?.toString() === loginUserId?.toString());
            if (alreadyLiked) {
                const blog = await Blog.findByIdAndUpdate(blogId, {
                    $pull: { likes: loginUserId },
                    isLiked: false,
                }, {
                    new: true
                });
                return res.status(201).json({ msg: "", Blog: blog });
            }
            if (isDisliked) {
                const blog = await Blog.findByIdAndUpdate(blogId, {
                    $pull: { dislikes: loginUserId },
                    isDisliked: false,
                }, {
                    new: true
                });
                return res.status(201).json({ msg: "", Blog: blog });
            } else {
                const blog = await Blog.findByIdAndUpdate(blogId, {
                    $push: { dislikes: loginUserId },
                    isDisliked: true,
                }, {
                    new: true
                });
                return res.status(201).json({ msg: "", Blog: blog });
            }

        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),
    uploadImages: asynchandler(async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const uploader = (path) => cloudinaryUpload.cloudinaryUpload(path, "images");
            const urls = [];
            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newpath = await uploader(path);
                urls.push(newpath);
               
                fs.unlinkSync(path);
            }
            const findBlog = await Blog.findByIdAndUpdate(id,
                {
                    images: urls.map(file => {
                        return file;
                    })
                },
                {
                    new: true
                }
            );
            return res.status(201).json({ msg: "Images Blog Upload Succesfully", findBlog })
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }),

}