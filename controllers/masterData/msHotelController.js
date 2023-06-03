"use strict"

const { Op } = require('sequelize');
const db = require('../../config/sequelize');
const { responseSuccess, responseError } = require('../../utils/response');
const { paginattionGenerator } = require('../../utils/pagination');
const hotelModel = db.masterHotel;

const create = async (req, res) => {
    try {
        await hotelModel.create({
            countryCode: req.body.countryCode,
            cityCode: req.body.cityCode,
            locationCode: req.body.locationCode,
            name: req.body.name,
            code: req.body.name,
            email: req.body.email,
            phone: req.body.telephone,
            website: req.body.website,
            address: req.body.address,
            zipCode: req.body.zipCode,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            checkInTime: req.body.checkInTime,
            checkOutTime: req.body.checkOutTime,
            star: req.body.star,
            totalRoom: req.body.totalRoom,
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
        const query = await hotelModel.findAndCountAll({
            attributes: [
                'countryCode',
                'cityCode',
                'locationCode',
                'name',
                'code',
                'email',
                'phone',
                'website',
                'address',
                'zipCode',
                'latitude',
                'longitude',
                'checkInTime',
                'checkOutTime',
                'star',
                'totalRoom',
                'status',
                'createdBy',
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
        const data = await hotelModel.findOne({
            attributes: [
                'countryCode',
                'cityCode',
                'locationCode',
                'name',
                'code',
                'email',
                'phone',
                'website',
                'address',
                'zipCode',
                'latitude',
                'longitude',
                'checkInTime',
                'checkOutTime',
                'star',
                'totalRoom',
                'status',
                'createdBy',
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
        await hotelModel.update({
            countryCode: req.body.countryCode,
            cityCode: req.body.cityCode,
            locationCode: req.body.locationCode,
            name: req.body.name,
            code: req.body.code,
            email: req.body.email,
            phone: req.body.telephone,
            website: req.body.website,
            address: req.body.address,
            zipCode: req.body.zipCode,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            checkInTime: req.body.checkInTime,
            checkOutTime: req.body.checkOutTime,
            star: req.body.star,
            totalRoom: req.body.totalRoom,
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
        await hotelModel.destroy({ where: { id: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const listDropdown = async (req, res) => {
    try {
        const data = await hotelModel.findAll({
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