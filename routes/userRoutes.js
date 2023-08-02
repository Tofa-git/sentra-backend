"use strict"
const userController = require('./../controllers/users/userController');
const userSalesController = require('./../controllers/userSales/userSalesController');
const router = require('express').Router();
const auth = require('../middlewares/auth');

router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/loginAdmin', userController.loginAdmin);
router.post('/verifyUserToken', userController.verifyToken)
// router.post('/verifyUserOtp',userController.verifyToken)
router.get('/users', auth, userController.getUsers);
router.get('/users-dd', auth, userController.usersDD);
router.get('/user', auth, userController.getUser);
router.put('/user/:id', auth, userController.update);
router.delete('/user/:id', auth, userController.destroy);

//#region Sales
router.post('/userSale', auth,userSalesController.createSale);
router.get('/userSale', auth, userSalesController.getSale);
router.get('/userSales', auth, userSalesController.getSales);
router.put('/userSale/:id', auth, userSalesController.update);
router.delete('/userSale/:id', auth, userSalesController.destroy);
router.get('/userSale-dd/', auth, userSalesController.salesDD);
//#endregion

module.exports = router;
