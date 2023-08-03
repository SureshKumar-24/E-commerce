const express = require('express');
const BlogCategory = require('../Controllers/blogcategory_controller');
const router = express.Router();
const Verifytoken = require('../Helpers/verify_token');


router.get('/blogetcategory/:id', BlogCategory.getCategory);
router.get('/blogallcategory', BlogCategory.getallCategory);
router.post('/blogcategory', Verifytoken.verify, Verifytoken.isAdmin, BlogCategory.createCategory);
router.post('/blogupdatecategory/:id', Verifytoken.verify, Verifytoken.isAdmin, BlogCategory.updateCategory);
router.delete('/blogdeletecategory/:id', Verifytoken.verify, Verifytoken.isAdmin, BlogCategory.deleteCategory);
module.exports = router;