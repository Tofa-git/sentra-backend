"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const jwt = require('jsonwebtoken');
const supplierModel = db.supplier;
const cityDataModel = db.cityCode;
const supplierApiModel = db.supplierApi;
const generalConfig = require('../../config/generalConfig');
const { success, error, validation } = require("../../utils/responseApi");
const { responseSuccess, responseError } = require('../../utils/response');


const getSupApis = async (req, res) => {
    try {

        const data = await supplierApiModel.findAll({
            attributes: ['id', 'supplierId', 'name', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
        });


        // Retrieve the supplier data for each entry
        const responseData = await Promise.all(
            data.map(async (entry) => {
                const supplierData = await supplierModel.findOne({
                    where: { id: entry.supplierId },
                    attributes: [
                        'id',
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
                        'urlApi',
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
                    supplier: supplierData ? supplierData.toJSON() : null,
                };
            })
        );

        res.status(200).send(responseSuccess('Data found.', responseData));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const supApiDD = async (req, res) => {
    try {
        const data = await supplierApiModel.findAll({
            attributes:
                [
                    'id', 'cityId', 'supplierManId', 'phoneFirst', 'phoneSecond', 'status'
                ],
        });

        res.status(200).send(responseSuccess('Data found.', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const getSupApi = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const data = await supplierApiModel.findOne({
            attributes: ['id', 'supplierId', 'name', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            where: { id },
        });

        if (!data) {
            return res.status(404).send(responseError('Data not found.'));
        }

        // Decrypt the encrypted attributes
        const decryptedData = {
            id: data.id,
            supplierId: data.supplierId,
            name: data.name,
            endpoint: generalConfig.decryptData(data.endpoint),
            method: data.method,
            code: generalConfig.decryptData(data.code),
            user: generalConfig.decryptData(data.user),
            password: generalConfig.decryptData(data.password),
            body: generalConfig.decryptData(data.body),
            status: data.status,
        };

        const supplierData = await supplierModel.findOne({
            where: { id: data.supplierId },
            attributes: [
                'id',
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
                'urlApi',
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
            ...decryptedData,
            supplier: supplierData ? supplierData.toJSON() : null,
        };

        res.status(200).send(responseSuccess('Data found.', responseData));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
};

const createSupApi = async (req, res, next) => {
    // console.log(req)
    const userId = req.user.id;
    // let passwordHash = generalConfig.encryptPassword(req.body.password);    
    if (req.body && Array.isArray(req.body)) {
        const suppliers = req.body.map(
            supplier => {
                return {
                    supplierId: supplier.supplierId,
                    name: supplier.name,
                    endpoint: generalConfig.encryptData(supplier.endpoint),
                    method: supplier.method,
                    code: generalConfig.encryptData(supplier.code),
                    user: generalConfig.encryptData(supplier.user),
                    password: generalConfig.encryptData(supplier.password),
                    body: generalConfig.encryptData(supplier.body),
                    createdBy: userId,
                    status: 1,
                }
            });


        try {
            await supplierApiModel.bulkCreate(suppliers).then(data => {
                res.status(201).send({ data: data, message: 'Supplier API Created successfully' });
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
    const id = req.params.id;
    // Extract userId from JWT token
    const userId = req.user.id;
    if (req.body && Array.isArray(req.body)) {
        const currencies = req.body.map(
            response => {
                return {
                    cityId: response.cityId,
                    supplierManId: response.supplierManId,
                    phoneFirst: response.phoneFirst,
                    phoneSecond: response.phoneSecond,
                    status: response.status,
                    updatedBy: userId,
                }
            });
        const updatedData = await msCurrencyModel.update(currencies, { where: { id: id } });

        if (updatedData[0] > 0) {
            res.status(200).send({ message: 'Success Updated the data.', data: updatedData });
        } else {
            res.status(404).send({ message: 'Could not update the data.' });
        }
    } else {
        res.status(500).send({ message: 'Bad Request Check Your Request' });
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
    createSupApi,
    getSupApi,
    getSupApis,
    supApiDD,
    update,
    destroy,
}