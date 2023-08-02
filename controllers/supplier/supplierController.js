"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const constants = require('../../config/constants');
const jwt = require('jsonwebtoken');
const suppliersModel = db.supplier;
const suppmanModel = db.supplierManager;
const suppapiModel = db.supplierApi;
const suppemergModel = db.supplierEmergency;
const cityDataModel = db.cityCode;
const { success, error, validation } = require("../../utils/responseApi");
const { paginattionGenerator } = require('../../utils/pagination');
const { responseSuccess, responseError } = require('../../utils/response');

const getSuppliers = async (req, res) => {
    try {
        const data = await suppliersModel.findAndCountAll({
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
                'remark',
                'creditDay',
                'exchangeRate',
                'isEmailVerified',
                'agentMarkup',
                'xmlMapping',
                'status',
            ],
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
                    {
                        code: {
                            [Op.like]: ['%' + (req.query.code ?? '') + '%'],
                        },
                    },
                ]
            }
        });

        // Retrieve the suppman data for each entry
        const responseData = await Promise.all(
            data.rows.map(async (entry) => {
                const suppapiData = await suppapiModel.findAll({
                    where: { supplierId: entry.id },
                    attributes: ['id', 'supplierId', 'name', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
                });

                const suppmanData = await suppmanModel.findAll({
                    where: { supplierId: entry.id },
                    attributes: ['id', 'uid', 'name', 'mobile', 'email'],
                });

                const suppmanIds = suppmanData.map((suppman) => suppman.id);

                const suppemergData = await suppemergModel.findAll({
                    where: { supplierManId: suppmanIds },
                    attributes: ['id', 'cityId', 'supplierManId', 'phoneFirst', 'phoneSecond', 'status'],
                });

                const suppManEmerg = await Promise.all(
                    suppmanData.map(async (suppman) => {
                        const emergData = suppemergData.filter((emergency) => emergency.supplierManId === suppman.id);

                        const emergDataWithCity = await Promise.all(
                            emergData.map(async (emergency) => {
                                const cityData = await cityDataModel.findOne({
                                    where: { id: emergency.cityId },
                                    attributes: ['id', 'code', 'long_name', 'short_name'],
                                });

                                return {
                                    ...emergency.toJSON(),
                                    ...cityData.toJSON(),
                                };
                            })
                        );

                        return {
                            ...suppman.toJSON(),
                            suppEmerg: emergDataWithCity,
                        };
                    })
                );

                return {
                    ...entry.toJSON(),
                    suppMan: suppManEmerg,
                    suppApi:suppapiData,
                };
            })
        );

        const result = paginattionGenerator(req, {
            count: data.count,
            rows: responseData,
        });
        res.status(200).send(responseSuccess('Data found.', result));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const supplierDD = async (req, res) => {
    try {
        const data = await suppliersModel.findAll({
            attributes: [
                'id',
                'code',
                'name',
            ],
        });

        res.status(200).send(responseSuccess('Data found.', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const getSupplier = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const data = await suppliersModel.findOne({
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
            where: { id },
        });

        if (!data) {
            return res.status(404).send(responseError('Data not found.'));
        }

        const suppmanData = await suppmanModel.findAll({
            where: { supplierId: data.id },
            attributes: ['id', 'uid', 'name', 'mobile', 'email'],
        });

        const suppapiData = await suppapiModel.findAll({
            where: { supplierId: entry.id },
            attributes: ['id', 'supplierId', 'name', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
        });

        const responseData = {
            ...data.toJSON(),
            suppMan: suppmanData.map((suppman) => suppman.toJSON()),
            suppApi: suppapiData.map((suppapi) => suppapi.toJSON()),
        };

        res.status(200).send(responseSuccess('Data found.', responseData));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
}

const createSupplier = async (req, res, next) => {
    const userId = req.user.id;
    // let passwordHash = generalConfig.encryptPassword(req.body.password);    
    if (req.body && Array.isArray(req.body)) {
        const suppliers = req.body.map(
            supplier => {
                return {
                    code: supplier.code,
                    name: supplier.name,
                    category: supplier.category,
                    mobile: supplier.mobile,
                    fax: supplier.fax,
                    email: supplier.email,
                    rqEmail: supplier.rqEmail,
                    ccEmail: supplier.ccEmail,
                    address: supplier.address,
                    url: supplier.url,
                    urlApi: supplier.urlApi,
                    remark: supplier.remark,
                    creditDay: supplier.creditDay,
                    exchangeRate: supplier.exchangeRate,
                    agentMarkup: supplier.agentMarkup,
                    xmlMapping: supplier.xmlMapping,
                    createdBy: userId,
                    status: 1,
                }
            });


        try {
            await suppliersModel.bulkCreate(suppliers).then(data => {
                res.status(201).send({ data: data, message: 'Supplier Created successfully' });
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
        const supplier = req.body.map(
            response => {
                return {
                    code: response.code,
                    name: response.name,
                    category: response.category,
                    mobile: response.mobile,
                    fax: response.fax,
                    email: response.email,
                    rqEmail: response.rqEmail,
                    ccEmail: response.ccEmail,
                    address: response.address,
                    url: response.url,
                    urlApi: response.urlApi,
                    remark: response.remark,
                    creditDay: response.creditDay,
                    exchangeRate: response.exchangeRate,
                    agentMarkup: response.agentMarkup,
                    xmlMapping: response.xmlMapping,
                    status: response.status,
                    updatedBy: userId,
                }
            });
        const updatedData = await suppliersModel.update(supplier, { where: { id: id } });

        if (updatedData[0] > 0) {
            res.status(201).send(responseSuccess('Data updated successfully'));
        } else {
            res.status(404).send({ message: 'Could not update the data.' });
        }
    } else {
        res.status(500).send(responseError("Couldn't update the data"))
    }
}

const destroy = async (req, res) => {
    try {
        await suppliersModel.destroy({ where: { id: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

module.exports = {
    createSupplier,
    getSuppliers,
    getSupplier,
    supplierDD,
    update,
    destroy,
}