"use strict"

const { Op } = require('sequelize');
const db = require('../../config/sequelize');
const { responseSuccess, responseError } = require('../../utils/response');
const { paginattionGenerator } = require('../../utils/pagination');
const nationalityModel = db.nationality;

const create = async (req, res) => {
    try {
        await nationalityModel.create({
            rank: req.body.rank,
            name: req.body.name,
            code: req.body.code,
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
        const query = await nationalityModel.findAndCountAll({
            attributes: [
                'id',
                'rank',
                'name',
                'code',
                'status'
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
                        code: {
                            [Op.like]: ['%' + (req.query.code ?? '') + '%'],
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
        const data = await nationalityModel.findOne({
            attributes: [
                'id',
                'rank',
                'name',
                'code',
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
        await nationalityModel.update({
            rank: req.body.rank,
            name: req.body.name,
            code: req.body.code,
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
        await nationalityModel.destroy({ where: { id: req.params.id } });

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