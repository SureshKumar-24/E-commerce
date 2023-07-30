const express = require('express');
const { body } = require('express-validator');
const Product = require('../Controllers/product_controller');
const router = express.Router();
const Verfiytoken = require('../Helpers/verify_token');


router.post('/product',Verfiytoken.verify, Verfiytoken.isAdmin, Product.createProduct);
router.get('/getproduct/:id', Product.getProduct);
router.get('/getallproduct', Product.getallProduct);
router.post('/updateproduct/:id', Verfiytoken.verify, Verfiytoken.isAdmin, Product.productUpdate);
router.delete('/deleteproduct/:id', Verfiytoken.verify, Verfiytoken.isAdmin, Product.deleteUpdate);
module.exports = router;