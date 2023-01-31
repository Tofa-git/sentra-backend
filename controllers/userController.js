"use strict"

const db = require('../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../config/constants');
const jwt = require('jsonwebtoken');
const userModel = db.users;
const { sendWelcomeEmail } = require('../emails/emailAccount');
const generalConfig = require('../config/generalConfig');

const createUser = async (req, res, next) => {    
    let passwordHash = generalConfig.encryptPassword(req.body.password);
    const { firstName, lastName, email, mobile, password, address,roleId } = req.body;
    const user = {
        firstName: firstName,
        roleId: roleId,
        lastName: lastName,
        mobile: mobile,
        email: email,
        password: passwordHash,
        address: address,
        status:1,
    }

    try {
        const createdUser = await userModel.create(user);
        // sendWelcomeEmail(req.body.email, req.body.firstName);

        res.status(201).send({ createdUser: createdUser, message: 'user created successfully' });
    } catch {
        res.status(500).send({ message: 'User already registered !' })
    }
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (email) {
        let passwordMatchFlag
        const user = await userModel.findOne({ attributes: ['firstName', 'lastName', 'email', 'mobile', 'password', 'address'], where: { email: email } });

        if (user) {            
            passwordMatchFlag = generalConfig.comparePassword(password, user.password)
        }

        if (!user) {
            return res.status(401).send({ message: 'Please enter coorrect email and password !' });
        } else if (passwordMatchFlag) {
            const jwToken = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "30m" });
            user.password = undefined;
            return res.status(200).send({ message: 'Loggedin nsuccessfully !', user, token: jwToken, expirationDuration: 1800 })
        } else {
            return res.status(401).send({ message: 'Please enter coorrect email and password !' });
        }
    }
}


module.exports = {
    createUser,
    loginUser,
}