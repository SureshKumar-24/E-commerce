const express = require('express');
const { body } = require('express-validator');
const Product = require('../Controllers/product_controller');
const router = express.Router();
const Verifytoken = require('../Helpers/verify_token');
const { uploadPhoto, productImgResize } = require('../Helpers/uploadimages');


router.post('/product', Verifytoken.verify, Verifytoken.isAdmin, Product.createProduct);
router.get('/getproduct/:id', Product.getProduct);
router.get('/getallproduct', Product.getallProduct);
router.post('/product/upload/:id', Verifytoken.verify, Verifytoken.isAdmin, uploadPhoto.array('images', 10),productImgResize,Product.uploadImages);
router.post('/updateproduct/:id', Verifytoken.verify, Verifytoken.isAdmin, Product.productUpdate);
router.delete('/deleteproduct/:id', Verifytoken.verify, Verifytoken.isAdmin, Product.deleteUpdate);
router.post('/wishlist', Verifytoken.verify, Product.addtoWishlist);
router.post('/rating', Verifytoken.verify, Product.rating);
module.exports = router;