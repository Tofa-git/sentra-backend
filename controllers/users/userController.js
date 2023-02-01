"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const jwt = require('jsonwebtoken');
const userModel = db.users;
const { sendWelcomeEmail } = require('../../emails/emailAccount');
const generalConfig = require('../../config/generalConfig');

const createUser = async (req, res, next) => {
    // let passwordHash = generalConfig.encryptPassword(req.body.password);

    if (req.body && Array.isArray(req.body)) {
        const users = req.body.map(
            user => {
                return {
                    firstName: user.firstName,
                    roleId: user.roleId,
                    lastName: user.lastName,
                    mobile: user.mobile,
                    email: user.email,
                    password: generalConfig.encryptPassword(user.password),
                    address: user.address,
                    status: 1,
                }
            });
        await userModel.bulkCreate(users).then(data => {
            res.status(201).send({data:data,  message:'user created successfully'});
        })
            .catch(err => {
                res.status(500).send({
                    data : null,
                    message:
                        err.message = 
                        "Validation Error" ? "The Email is Already Exist" : "Some error occurred while creating the Users."                        
                });
            });       

    }
    // else{
    //     const user = {
    //         firstName: firstName,
    //         roleId: roleId,
    //         lastName: lastName,
    //         mobile: mobile,
    //         email: email,
    //         password: generalConfig.encryptPassword(password),
    //         address: address,
    //         status: 1,
    //     }
    //     const createdUser = await userModel.create(user);
    //     try {

    //         // sendWelcomeEmail(req.body.email, req.body.firstName);

    //         res.status(201).send({ createdUser: createdUser, message: 'user created successfully' });
    //     } catch {
    //         res.status(500).send({ message: 'User already registered !' })
    //     }
    // }

}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (email) {
        let passwordMatchFlag
        const user = await userModel.findOne({ attributes: ['id','firstName', 'lastName', 'email', 'mobile', 'password', 'address'], where: { email: email } });

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