"use strict"
const userController = require('./../controllers/users/userController');
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

module.exports = router;
