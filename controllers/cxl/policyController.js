"use strict"

const { Op } = require('sequelize');
const db = require('../../config/sequelize');
const { responseSuccess, responseError } = require('../../utils/response');
const { paginattionGenerator } = require('../../utils/pagination');
const cxlPolicyModel = db.cxlPolicy;

const create = async (req, res) => {
    try {
        await cxlPolicyModel.create({
            name: req.body.name,
            code: req.body.code,
            day_1: req.body.day_1,
            time_1: req.body.time_1,
            type_1: req.body.type_1,
            tnight_1: req.body.tnight_1,
            day_2: req.body.day_2,
            time_2: req.body.time_2,
            type_2: req.body.type_2,
            tnight_2: req.body.tnight_2,
            day_3: req.body.day_3,
            time_3: req.body.time_3,
            type_3: req.body.type_3,
            tnight_3: req.body.tnight_3,
            day_4: req.body.day_4,
            time_4: req.body.time_4,
            type_4: req.body.type_4,
            tnight_4: req.body.tnight_4,
            createdBy: req.user.id,
        })

        res.status(201).send(responseSuccess('Data created successfully'));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
}

const list = async (req, res) => {
    try {
        const query = await cxlPolicyModel.findAndCountAll({
            attributes: [
                'id',
                'name',
                'day_1',
                'time_1',
                'type_1',
                'night_1',
                'day_2',
                'time_2',
                'type_2',
                'night_2',
                'day_3',
                'time_3',
                'type_3',
                'night_3',
                'day_4',
                'time_4',
                'type_4',
                'night_4',
                'code',
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
        const data = await cxlPolicyModel.findOne({
            attributes: [
                'id',
                'name',
                'day_1',
                'time_1',
                'type_1',
                'night_1',
                'day_2',
                'time_2',
                'type_2',
                'night_2',
                'day_3',
                'time_3',
                'type_3',
                'night_3',
                'day_4',
                'time_4',
                'type_4',
                'night_4',
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
        await cxlPolicyModel.update({
            name: req.body.name,
            code: req.body.code,
            day_1: req.body.day_1,
            time_1: req.body.time_1,
            type_1: req.body.type_1,
            tnight_1: req.body.tnight_1,
            day_2: req.body.day_2,
            time_2: req.body.time_2,
            type_2: req.body.type_2,
            tnight_2: req.body.tnight_2,
            day_3: req.body.day_3,
            time_3: req.body.time_3,
            type_3: req.body.type_3,
            tnight_3: req.body.tnight_3,
            day_4: req.body.day_4,
            time_4: req.body.time_4,
            type_4: req.body.type_4,
            tnight_4: req.body.tnight_4,
            updatedBy: req.user.id,
        }, { where: { id: req.params.id } })

        res.status(201).send(responseSuccess('Data updated successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const destroy = async (req, res) => {
    try {
        await cxlPolicyModel.destroy({ where: { id: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const listDropdown = async (req, res) => {
    try {
        const data = await cxlPolicyModel.findAll({
            attributes: [
                'id',
                'name',
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