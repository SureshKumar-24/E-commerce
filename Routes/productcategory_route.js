const express = require('express');
const Category = require('../Controllers/productcategory_controller');
const router = express.Router();
const Verifytoken = require('../Helpers/verify_token');


router.get('/getcategory/:id', Category.getCategory);
router.get('/getallcategory', Category.getallCategory);
router.post('/category', Verifytoken.verify, Verifytoken.isAdmin, Category.createCategory);
router.post('/updatecategory/:id', Verifytoken.verify, Verifytoken.isAdmin, Category.updateCategory);
router.delete('/deletecategory/:id', Verifytoken.verify, Verifytoken.isAdmin, Category.deleteCategory);
module.exports = router;