"use strict"

const db = require('../../config/sequelize');
const { Op } = require('sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const jwt = require('jsonwebtoken');
const userSalesModel = db.userSales;
const { paginattionGenerator } = require('../../utils/pagination');
const { responseSuccess, responseError } = require('../../utils/response');


const getSales = async (req, res) => {
    try {
        const query = await userSalesModel.findAndCountAll({
            attributes: ['id', 'username', 'name', 'email', 'mobile','manager'],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
            where: {
                [Op.and]: [
                    {
                        email: {
                            [Op.like]: ['%' + (req.query.email ?? '') + '%'],
                        },
                    },
                    {
                        name: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    },
                ]
            }
        });        
        const data = paginattionGenerator(req, query);
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

const update = async (req, res) => {
    try {
        await userSalesModel.update({
            username: req.body.username,
            name: req.body.name,
            manager: req.body.manager,
            mobile: req.body.mobile,
            email: req.body.email,                                        
            status: req.body.status,
            updatedBy: req.user.id,
        }, { where: { id: req.params.id } })

        res.status(201).send(responseSuccess('Data updated successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const destroy = async (req, res) => {
    try {
        await userSalesModel.destroy({ where: { id: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

module.exports = {
    createSale,        
    getSales,
    getSale,    
    salesDD,
    update,
    destroy,
}