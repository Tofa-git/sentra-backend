"use strict"

const { Op } = require('sequelize');
const db = require('../../config/sequelize');
const { paginattionGenerator } = require('../../utils/pagination');
const msCountryCodeModel = db.countryCode;
const { responseError, responseSuccess } = require('../../utils/response');

const create = async (req, res) => {
    try {
        await msCountryCodeModel.create({
            isoId: req.body.isoId,
            iso3: req.body.iso3,
            sequence: req.body.sequence,
            name: req.body.name,
            dial: req.body.dial,
            basicCurrency: req.body.basicCurrency,
            descCurrency: req.body.descCurrency,
            status: req.body.status,
            createdBy: req.user.id,
        })

        res.status(201).send(responseSuccess('Data created successfully'));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
}

const list = async (req, res) => {
    try {
        const query = await msCountryCodeModel.findAndCountAll({
            attributes: [
                'id',
                'isoId',
                'iso3',
                'sequence',
                'name',
                'dial',
                'basicCurrency',
                'descCurrency',
                'status',
            ],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
            where: {
                [Op.and]: [
                    {
                        name: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    },
                    {
                        isoId: {
                            [Op.like]: ['%' + (req.query.isoId ?? '') + '%'],
                        },
                    },
                ]
            }
        });

        const data = paginattionGenerator(req, query);

        res.status(200).send(responseSuccess('Success', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const detail = async (req, res) => {
    try {
        const data = await msCountryCodeModel.findOne({
            attributes: [
                'id',
                'isoId',
                'iso3',
                'sequence',
                'name',
                'dial',
                'basicCurrency',
                'descCurrency',
                'status',
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
        await msCountryCodeModel.update({
            isoId: req.body.isoId,
            iso3: req.body.iso3,
            sequence: req.body.sequence,
            name: req.body.name,
            dial: req.body.dial,
            basicCurrency: req.body.basicCurrency,
            descCurrency: req.body.descCurrency,
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
        await msCountryCodeModel.destroy({ where: { id: req.params.id } });

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