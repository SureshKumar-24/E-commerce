const express = require('express');
const Brand = require('../Controllers/brand_controller');
const router = express.Router();
const Verifytoken = require('../Helpers/verify_token');


router.get('/getbrand/:id', Brand.getBrand);
router.get('/allbrand', Brand.getallBrand);
router.post('/brand', Verifytoken.verify, Verifytoken.isAdmin, Brand.createBrand);
router.post('/updatebrand/:id', Verifytoken.verify, Verifytoken.isAdmin, Brand.updateBrand);
router.delete('/deletebrand/:id', Verifytoken.verify, Verifytoken.isAdmin, Brand.deleteBrand);
module.exports = router;