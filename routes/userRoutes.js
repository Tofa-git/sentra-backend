"use strict"
const { check, body, validationResult } = require('express-validator/check');
const userController = require('./../controllers/userController');
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


module.exports = router;
