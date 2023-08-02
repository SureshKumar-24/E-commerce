const express = require('express');
const Blog = require('../Controllers/blog_controller');
const router = express.Router();
const Verifytoken = require('../Helpers/verify_token');

router.get('/getblog/:id', Blog.getBlog);
router.get('/getallblog', Blog.getAllBlog);
router.post('/blog', Verifytoken.verify, Verifytoken.isAdmin, Blog.createBlog);
router.post('/blog/:id', Verifytoken.verify, Verifytoken.isAdmin, Blog.updateBlog);
router.delete('/deleteblog/:id', Verifytoken.verify, Verifytoken.isAdmin, Blog.deleteBlog);
router.post('/like', Verifytoken.verify, Blog.likeBlog);
router.post('/dislike', Verifytoken.verify, Blog.dislikeBlog);
module.exports = router;