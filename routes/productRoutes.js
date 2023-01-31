"use strict"

const productController = require('./../controllers/productController');
const auth = require('../middlewares/auth');

const router = require('express').Router();
const extractFile = require('../middlewares/check-img-mime-type');
const middleErrMsg = require('../config/errorMsg');

router.post('/product', auth, extractFile, productController.addProduct, middleErrMsg);
router.get('/products', auth, productController.getProducts);
router.get('/product/:id', auth, productController.getProduct);
router.put('/product/:id', auth, extractFile, productController.editProduct);
router.delete('/product/:id', auth, productController.deleteProduct);



module.exports = router;