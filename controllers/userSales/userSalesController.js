"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const jwt = require('jsonwebtoken');
const userSalesModel = db.userSales;
const { success, error, validation } = require("../../utils/responseApi");
const { responseSuccess, responseError } = require('../../utils/response');


const getSales = async (req, res) => {
    try {
        const data = await userSalesModel.findAll({
            attributes: ['id', 'username', 'name', 'email', 'mobile','manager'],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
        });        
        res.status(200).send(responseSuccess('Data found.', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const salesDD = async (req, res) => {
    try {
        const data = await userSalesModel.findAll({
            attributes: ['id', 'username', 'name', 'email', 'mobile','manager'],
        });

        res.status(200).send(responseSuccess('Data found.', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const getSale = async (req, res, next) => {
    try {
        const id = req.user?.id;
        const data = await userSalesModel.findOne({
            attributes: ['id', 'username', 'name', 'email', 'mobile','manager'],
            where: { id },
        });

        res.status(200).send(responseSuccess('Data found.', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const createSale = async (req, res, next) => {
    // let passwordHash = generalConfig.encryptPassword(req.body.password);    
    if (req.body && Array.isArray(req.body)) {
        const users = req.body.map(
            user => {
                return {
                    username: user.username,
                    name: user.name,
                    manager: user.manager,
                    mobile: user.mobile,
                    email: user.email,                                        
                    status: 1,
                }
            });


        try {          
            await userSalesModel.bulkCreate(users).then(data => {
                res.status(201).send({ data: data, message: 'user sales created successfully' });
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
}

module.exports = {
    createSale,        
    getSales,
    getSale,    
    salesDD,
}