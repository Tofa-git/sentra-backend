"use strict"

const db = require('../../config/sequelize');
const { responseSuccess, responseError } = require('../../utils/response');
const paymentMethodModel = db.masterPaymentMethod;

const create = async (req, res) => {
    try {
        await paymentMethodModel.create({
            name: req.body.name,
            code: req.body.code,
            createdBy: req.user.id,
        })

        res.status(201).send(responseSuccess('Data created successfully'));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
}

const list = async (req, res) => {
    try {
        const data = await paymentMethodModel.findAll({
            attributes: [
                'id',
                'name',
                'code',
            ],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
        });

        res.status(200).send(responseSuccess('Success', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const detail = async (req, res) => {
    try {
        const data = await paymentMethodModel.findOne({
            attributes: [
                'id',
                'name',
                'code',
            ],
            where: {
                id: req.params.id,
            }
        });

        res.status(200).send(responseSuccess('Success', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const update = async (req, res) => {
    try {
        await paymentMethodModel.update({
            name: req.body.name,
            code: req.body.code,
            updatedBy: req.user.id,
        }, { where: { id: req.params.id } })

        res.status(201).send(responseSuccess('Data updated successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const destroy = async (req, res) => {
    try {
        await paymentMethodModel.destroy({ where: { id: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}


module.exports = {
    create,
    list,
    detail,
    update,
    destroy,
}