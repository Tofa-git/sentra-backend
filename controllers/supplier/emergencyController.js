"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const jwt = require('jsonwebtoken');
const supplierManagerModel = db.supplierManager;
const cityDataModel = db.cityCode;
const supplierEmergModel = db.supplierEmergency;
const generalConfig = require('../../config/generalConfig');
const { success, error, validation } = require("../../utils/responseApi");
const { responseSuccess, responseError } = require('../../utils/response');


const getSupEmergs = async (req, res) => {    
    try {
        
        const data = await supplierEmergModel.findAll({
            attributes: ['id', 'cityId', 'supplierManId', 'phoneFirst', 'phoneSecond', 'status'],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
        });

        
         // Retrieve the supplier data for each entry
         const responseData = await Promise.all(
            data.map(async (entry) => {
                const supplierData = await supplierManagerModel.findOne({
                    where: { id: entry.supplierManId },
                    attributes: [
                        'id',
                        'uid',
                        'name',
                        'mobile',
                        'email',
                        'status',
                    ],
                });

                const cityData = await cityDataModel.findOne({
                    where: { id: entry.cityId },
                    attributes: [
                        'id',
                        'code',
                        'long_name',
                        'short_name',
                    ],
                });

                return {
                    ...entry.toJSON(),
                    supplier: supplierData ? supplierData.toJSON() : null,
                    city: cityData ? cityData.toJSON() : null
                };
            })
        );

        res.status(200).send(responseSuccess('Data found.', responseData));
    } catch (error) {        
        res.status(500).send(responseError(error))
    }
}

const supEmergDD = async (req, res) => {
    try {
        const data = await supplierEmergModel.findAll({
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

const getSupEmerg = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const data = await supplierEmergModel.findOne({
            attributes: [
                'id', 'cityId', 'supplierManId', 'phoneFirst', 'phoneSecond', 'status'
            ],
            where: { id },
        });

        if (!data) {
            return res.status(404).send(responseError('Data not found.'));
        }

        const supplierData = await supplierManagerModel.findOne({
            where: { id: data.supplierManId },
            attributes: [
                'uid',
                'name',
                'mobile',
                'email',
                'status',
            ],
        });
        const cityData = await cityDataModel.findOne({
            where: { id: data.cityId },
            attributes: [
                'code',
                'long_name',
                'short_name',
            ],
        });

        const responseData = {
            ...data.toJSON(),
            supplier: supplierData ? supplierData.toJSON() : null,
            city: cityData ? cityData.toJSON() : null
        };

        res.status(200).send(responseSuccess('Data found.', responseData));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
};

const createSupEmerg = async (req, res, next) => {
    const userId = req.user.id;
    // let passwordHash = generalConfig.encryptPassword(req.body.password);    
    if (req.body && Array.isArray(req.body)) {
        const suppliers = req.body.map(
            supplier => {
                return {
                    cityId: supplier.cityId,
                    supplierManId: supplier.supplierManId,
                    phoneFirst: supplier.phoneFirst,
                    phoneSecond: supplier.phoneSecond,
                    createdBy: userId,
                    status: 1,
                }
            });


        try {
            await supplierEmergModel.bulkCreate(suppliers).then(data => {
                res.status(201).send({ data: data, message: 'Supplier Emergency Created successfully' });
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
    createSupEmerg,
    getSupEmerg,
    getSupEmergs,
    supEmergDD,
    update,
    destroy,
}