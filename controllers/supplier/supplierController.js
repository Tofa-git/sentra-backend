"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const jwt = require('jsonwebtoken');
const suppliersModel = db.supplier;
const suppmanModel = db.supplierManager;
const { success, error, validation } = require("../../utils/responseApi");
const { responseSuccess, responseError } = require('../../utils/response');


const getSuppliers = async (req, res) => {
    try {
        const data = await suppliersModel.findAll({
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
        });

        // Retrieve the suppman data for each entry
        const responseData = await Promise.all(
            data.map(async (entry) => {
                const suppmanData = await suppmanModel.findAll({
                    where: { supplierId: entry.id }, // Use entry.id as the supplierId
                    attributes: [
                        'id',
                        'uid',
                        'name',
                        'mobile',
                        'email',
                    ],
                });

                return {
                    ...entry.toJSON(),
                    suppMan: suppmanData.map((suppman) => suppman.toJSON()),
                };
            })
        );

        res.status(200).send(responseSuccess('Data found.', responseData));
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
          return res.status(404).send(responseError('Supplier not found.'));
        }
    
        const suppmanData = await suppmanModel.findAll({
          where: { supplierId: data.id },
          attributes: ['id', 'uid', 'name', 'mobile', 'email'],
        });
    
        const responseData = {
          ...data.toJSON(),
          suppMan: suppmanData.map((suppman) => suppman.toJSON()),
        };
    
        res.status(200).send(responseSuccess('Data found.', responseData));
      } catch (error) {
        res.status(500).send(responseError(error));
      }
}

const createSupplier = async (req, res, next) => {
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
                    remark: supplier.remark,
                    creditDay: supplier.creditDay,
                    exchangeRate: supplier.exchangeRate,
                    agentMarkup: supplier.agentMarkup,
                    xmlMapping: supplier.xmlMapping,
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

module.exports = {
    createSupplier,
    getSuppliers,
    getSupplier,
    supplierDD,
}