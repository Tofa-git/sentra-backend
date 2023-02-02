"use strict"

const chalk = require('chalk');
const { request } = require('express');
const db = require('../../config/sequelize');
const msCityLocationModel = db.cityLocation;
const AppError = require('../../utils/appError')


const addMsCityLocations = async (req, res) => {
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const datas = req.body.map(
            response => {
                return {                    
                    cityId: response.cityId,
                    sequence: response.sequence,
                    name: response.name,
                    latitude: response.latitude,
                    longitude: response.longitude,                    
                    status: 1,
                    createdBy:userId,
                }
            });
        await msCityLocationModel.bulkCreate(datas).then(data => {
            res.status(201).send({ data: data, message: 'Data created successfully' });
        })
            .catch(err => {
                res.status(500).send({
                    data: null,
                    message:
                        err.message =
                        "Validation Error" ? err.message : "Some error occurred while creating the data."
                });
            });
    } else {
        res.status(500).send({ message: 'Bad Request Check Your Request' });
    }
}

const getMsCityLocations = async (req, res, next) => {
    if (!req.query.size || !req.query.page) return res.status(500).send({ message: 'page number and page size are required !' })
    let pageSize = +req.query.size;
    if (pageSize > 100) {
        pageSize = 100;
    }
    let pageOffset = ((+req.query.page - 1) * +req.query.size);
    const data = await msCityLocationModel.findAll({
        data: [
            'id',
            'cityId',
            'sequence',
            'name',
            'latitude',
            'longitude',            
            'status'
        ],
        offset: pageOffset,
        limit: pageSize,
    });

    if (data.length > 0) {
        res.status(200).send({ message: 'Success.', data: data });
    } else {
        res.status(404).send({ message: 'The data is not found.' });
    }

}

const getMsCityLocation = async (req, res) => {
    const id = req.params.id;
    const data = await msCityLocationModel.findOne({
        attributes: [
                'id',
                'cityId',
                'sequence',
                'name',
                'latitude',
                'longitude',            
                'status'
            ],
        where: {
            id: id
        }
    });

    if (data) {
        res.status(200).send({ message: 'Success.', data: data });
    } else {
        res.status(404).send({ message: 'The data is not found' });
    }

}

const editMsCityLocation = async (req, res) => {
    const id = req.params.id;
    // Extract userId from JWT token
    const userId = req.user.id;
    if (req.body && Array.isArray(req.body)) {
        const currencies = req.body.map(
            response => {
                return {
                    cityId: response.countryId,
                    sequence: response.sequence,
                    name: response.name,
                    latitude: response.latitude,
                    longitude: response.longitude,                   
                    status: response.status,
                    updatedBy:userId,
                }
            });
        const updatedData = await msCityLocationModel.update(currencies, { where: { id: id } });

        if (updatedData[0] > 0) {
            res.status(200).send({ message: 'Success Updated the data.', data: updatedData });
        } else {
            res.status(404).send({ message: 'Could not update the data.' });
        }
    } else {
        res.status(500).send({ message: 'Bad Request Check Your Request' });
    }
}

const deleteMsCityLocation = async (req, res) => {
    const id = req.params.id;
    const deletedData = await msCityLocationModel.destroy({ where: { id: id } });

    if (deletedData) {
        res.status(200).send({ message: 'The data deleted successfully.', data: deletedData });
    } else {
        res.status(404).send({ message: 'The data not deleted.' });
    }
}


module.exports = {
    addMsCityLocations,
    getMsCityLocations,
    getMsCityLocation,
    editMsCityLocation,
    deleteMsCityLocation
}