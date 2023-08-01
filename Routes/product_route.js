const express = require('express');
const { body } = require('express-validator');
const Product = require('../Controllers/product_controller');
const router = express.Router();
const Verifytoken = require('../Helpers/verify_token');


router.post('/product', Verifytoken.verify, Verifytoken.isAdmin, Product.createProduct);
router.get('/getproduct/:id', Product.getProduct);
router.get('/getallproduct', Product.getallProduct);
router.post('/updateproduct/:id', Verifytoken.verify, Verifytoken.isAdmin, Product.productUpdate);
router.delete('/deleteproduct/:id', Verifytoken.verify, Verifytoken.isAdmin, Product.deleteUpdate);
module.exports = router;