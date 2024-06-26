"use strict"

const { Op } = require('sequelize');
const db = require('../../config/sequelize');
const { responseSuccess, responseError } = require('../../utils/response');
const { paginattionGenerator } = require('../../utils/pagination');
const msCityCodeModel = db.cityCode;
const msCountryCodeModel = db.countryCode;

const create = async (req, res) => {
    try {
        await msCityCodeModel.create({
            countryId: req.body.countryId,
            sequence: req.body.sequence,
            name: req.body.name,
            code: req.body.code,
            long_name: req.body.longName,
            short_name: req.body.shortName,           
            status: 1,
            createdBy: req.user.id,
        })

        res.status(201).send(responseSuccess('Data created successfully'));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
}

const list = async (req, res) => {
    try {
        const data = await msCityCodeModel.findAndCountAll({
            attributes: [
                'id',
                'countryId',
                'sequence',
                'code',
                ['short_name', 'shortName'],
                ['long_name', 'longName'],
                'status'
            ],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
            where: {
                [Op.and]: [
                    {
                        long_name: {
                            [Op.like]: ['%' + (req.query.longName ?? '') + '%'],
                        },
                    },
                ]
            },
            order: [
                ['short_name', 'ASC'], // Sort by short_name in ascending order
            ],
        });

        // const data = paginattionGenerator(req, query);
        const responseData = await Promise.all(
            data.rows.map(async (entry) => {
                const countryData = await msCountryCodeModel.findOne({
                    where: { id: entry.countryId },
                    attributes: ['id', 'isoId', 'name', 'status'],
                });
            
                return {
                    ...entry.toJSON(),
                    country: countryData,
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

const detail = async (req, res) => {
    try {
        const data = await msCityCodeModel.findOne({
            attributes: [
                'id',
                'countryId',
                'sequence',
                'code',
                ['short_name', 'shortName'],
                ['long_name', 'longName'],
                'status'
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
        await msCityCodeModel.update({
            countryId: req.body.countryId,
            sequence: req.body.sequence,
            name: req.body.name,
            code: req.body.code,
            long_name: req.body.longName,
            short_name: req.body.shortName,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            status: 1,
            updatedBy: req.user.id,
        }, { where: { id: req.params.id } })

        res.status(201).send(responseSuccess('Data updated successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const destroy = async (req, res) => {
    try {
        await msCityCodeModel.destroy({ where: { id: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const listDropdown = async (req, res) => {
    try {
        const data = await msCityCodeModel.findAll({
            attributes: [
                'id',
                'code',
                'countryId',
                ['short_name', 'shortName'],
                ['long_name', 'longName'],
            ],
            where: { countryId: req.query.countryId },
            order: [
                ['long_name', 'ASC'], // Sort by short_name in ascending order
            ],
        });

        res.status(200).send(responseSuccess('Success', data));
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
    listDropdown,
}