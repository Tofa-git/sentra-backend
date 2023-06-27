"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const jwt = require('jsonwebtoken');
const supplierManagerModel = db.supplierManager;
const supplierModel = db.supplier;
const generalConfig = require('../../config/generalConfig');
const { success, error, validation } = require("../../utils/responseApi");
const { responseSuccess, responseError } = require('../../utils/response');


const getSupmans = async (req, res) => {
    try {
        const data = await supplierManagerModel.findAll({
            attributes: ['id', 'supplierId', 'uid', 'name', 'mobile', 'email'],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
        });

        // Retrieve the supplier data for each entry
        const responseData = await Promise.all(
            data.map(async (entry) => {
                const supplierData = await supplierModel.findOne({
                    where: { id: entry.supplierId },
                    attributes: [
                        'code',
                        'name',
                        'category',
                        'mobile',
                        'fax',
                        'email',
                        'rqEmail',
                        'ccEmail',
                        'address',
                        'url',
                        'remark',
                        'creditDay',
                        'exchangeRate',
                        'isEmailVerified',
                        'agentMarkup',
                        'xmlMapping',
                        'status',
                    ],
                });

                return {
                    ...entry.toJSON(),
                    supplier: supplierData.toJSON(),
                };
            })
        );

        res.status(200).send(responseSuccess('Data found.', responseData));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const supmanDD = async (req, res) => {
    try {
        const data = await supplierManagerModel.findAll({
            attributes: ['id', 'supplierId', 'uid', 'name', 'mobile', 'email'],
        });

        res.status(200).send(responseSuccess('Data found.', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const getSupman = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const data = await supplierManagerModel.findOne({
            attributes: ['id', 'supplierId', 'uid', 'name', 'mobile', 'email'],
            where: { id },
        });

        if (!data) {
            return res.status(404).send(responseError('Data not found.'));
        }

        const supplierData = await supplierModel.findOne({
            where: { id: data.supplierId },
            attributes: [
                'code',
                'name',
                'category',
                'mobile',
                'fax',
                'email',
                'rqEmail',
                'ccEmail',
                'address',
                'url',
                'remark',
                'creditDay',
                'exchangeRate',
                'isEmailVerified',
                'agentMarkup',
                'xmlMapping',
                'status',
            ],
        });

        const responseData = {
            ...data.toJSON(),
            supplier: supplierData ? supplierData.toJSON() : null,
        };

        res.status(200).send(responseSuccess('Data found.', responseData));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
};

const createSupman = async (req, res, next) => {
    // let passwordHash = generalConfig.encryptPassword(req.body.password);    
    if (req.body && Array.isArray(req.body)) {
        const suppliers = req.body.map(
            supplier => {
                return {
                    supplierId: supplier.supplierId,
                    uid: supplier.uid,
                    name: supplier.name,
                    mobile: supplier.mobile,
                    email: supplier.email,
                    password: generalConfig.encryptPassword(supplier.password),
                    status: 1,
                }
            });


        try {
            await supplierManagerModel.bulkCreate(suppliers).then(data => {
                res.status(201).send({ data: data, message: 'Supplier Manager Created successfully' });
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
    createSupman,
    getSupman,
    getSupmans,
    supmanDD,
}