"use strict"
const { check, body, validationResult } = require('express-validator/check');
const userController = require('./../controllers/users/userController');
const router = require('express').Router();

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email address.'),

        body('password')
            .isLength({ min: 5 })
            .withMessage('Password length must be at least 5 chars.'),
    ],
    userController.createUser);

router.post('/login', userController.loginUser);

router.post('/loginAdmin', userController.loginAdmin);

router.post('/verifyUserToken',userController.verifyToken)

// router.post('/verifyUserOtp',userController.verifyToken)

router.get('/users', userController.getUsers);

router.get('/user', userController.getUser);

module.exports = router;
