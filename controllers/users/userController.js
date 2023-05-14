"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const jwt = require('jsonwebtoken');
const userModel = db.users;
const { sendWelcomeEmail } = require('../../emails/emailAccount');
const { sendMail } = require('../../services/emailServices');
const { generateOTP } = require('../../services/otpServices');
const generalConfig = require('../../config/generalConfig');
const { success, error, validation } = require("../../utils/responseApi");
const { responseSuccess, responseError } = require('../../utils/response');


const getUsers = async (req, res, next) => {
    if (!req.query.size || !req.query.page) return res.status(500).send({ message: 'page number and page size are required !' })
    let pageSize = +req.query.size;
    if (pageSize > 100) {
        pageSize = 100;
    }
    let pageOffset = ((+req.query.page - 1) * +req.query.size);
    const data = await userModel.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email', 'mobile', 'address', 'image'],
        offset: pageOffset,
        limit: pageSize,
    });

    if (data.length > 0) {
        res.status(200).send({ message: 'Data found.', data: data });
    } else {
        res.status(404).send({ message: 'Data not found.' });
    }

}

const getUser = async (req, res, next) => {
    const id = req.user?.id;
    const data = await userModel.findOne({
        attributes: ['id', 'firstName', 'lastName', 'email', 'mobile', 'address', 'image'],
        where: { id },
    });

    res.status(200).send(responseSuccess('Data found.', data));
}

const createUser = async (req, res, next) => {
    // let passwordHash = generalConfig.encryptPassword(req.body.password);
    const otpGenerated = generateOTP();
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
                    otp: otpGenerated,
                    status: 1,
                }
            });


        try {
            await sendMail({
                to: users[0].email,
                OTP: otpGenerated,
            });
            await userModel.bulkCreate(users).then(data => {
                res.status(201).send({ data: data, message: 'user created successfully' });
            })
                .catch(err => {
                    res.status(500).send({
                        data: null,
                        message:
                            err.message =
                            "Validation Error" ? "The Email is Already Exist" : "Some error occurred while creating the Users."
                    });
                    console.log(err)
                });
        } catch (error) {
            return [false, 'Unable to sign up, Please try again later', error];
        }

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
        const user = await userModel.findOne({
            attributes: ['id', 'firstName', 'lastName', 'email', 'mobile', 'password', 'address', 'image'],
            where: { email: email }
        });

        if (user) {
            passwordMatchFlag = generalConfig.comparePassword(password, user.password)
        }

        if (passwordMatchFlag) {
            const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "30m" });
            user.password = undefined;

            res.status(200).send(responseSuccess("Loggedin nsuccessfully !", {
                user,
                token,
                expirationDuration: 1800,
            }));
        } else {
            res.status(401).send(responseError('Please enter coorrect email and password !'));
        }
    }
}

const loginAdmin = async (req, res) => {

    try {
        let adminData = req.body;
        let adminEmail = "admin@gmail.com";
        let password = "12345";
        if (adminEmail == adminData.email && password == adminData.password) {
            //    console.log(adminData)
            res.json({ status: "ok", admin: true })

        } else {
            res.json({ status: "failed", error: "admin details invalid" })
        }

    } catch (err) {
        res.json({ status: "error", error: "oops catch error" })
    }
}

const verifyToken = async (req, res) => {
    try {

        const decodedToken = jwt.verify(req.body.Token, 'secret')
        const user = await userModel.findOne({ attributes: ['id', 'firstName', 'lastName', 'email', 'mobile', 'password', 'address', 'image'], where: { email: decodedToken.email } });
        console.log(user)
        if (user.image) {
            user.image = `http://localhost:4000/${user.image}`
        }
        else {
            user.image = `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`
        }
        console.log(user.image)
        return res.status(200).json({ message: "token valid", data: user, token: true });

    } catch (err) {
        res.json({ status: 'error', error: "invalid token", token: false })
    }
}

module.exports = {
    createUser,
    loginUser,
    loginAdmin,
    verifyToken,
    getUsers,
    getUser,
}