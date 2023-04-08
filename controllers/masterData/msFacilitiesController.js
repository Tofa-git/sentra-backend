"use strict"

const chalk = require('chalk');
const { request } = require('express');
const db = require('../../config/sequelize');
const msFacilitiesModel = db.masterFacility
const AppError = require('../../utils/appError')
var axios = require('axios');

const addMsFacilities = async (req, res) => {
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const datas = req.body.map(
            facility => {
                return {
                    sequence: facility.sequence ?? 0,
                    description: facility.description,
                    code: facility.code,
                    status: 1,
                    createdBy: userId,
                }
            });

        

        await msFacilitiesModel.bulkCreate(datas).then(data => {
            res.status(201).send({ data: data, message: 'Data created successfully' });
        })
            .catch(err => {
                res.status(500).send({
                    data: null,
                    message:
                        err.message =
                        "Validation Error" ? err.message : "Some error occurred while creating the Master Breakfast."
                });
            });
    } else {
        res.status(500).send({ message: 'Bad Request Check Your Request' });
    }
}

const getMsFacilities = async (req, res, next) => {
    if (!req.query.size || !req.query.page) return res.status(500).send({ message: 'page number and page size are required !' })
    let pageSize = +req.query.size;
    if (pageSize > 100) {
        pageSize = 100;
    }
    let pageOffset = ((+req.query.page - 1) * +req.query.size);
    const data = await msFacilitiesModel.findAll({
        data: [
            'id',
            'sequence',
            'code',
            'description',
            'status'
        ],
        offset: pageOffset,
        limit: pageSize,
    });

    if (data.length > 0) {
        res.status(200).send({ message: 'Data found.', data: data, totalData: 12 });
    } else {
        res.status(404).send({ message: 'Data not found.', success: false });
    }

}

const getMsFacility = async (req, res) => {
    const id = req.params.id;
    const data = await msFacilitiesModel.findOne({
        attributes: ['id', 'sequence', 'description', 'code', 'status'],
        where: {
            id: id
        }
    });

    if (data) {
        res.status(200).send({ message: 'Data found.', data: data });
    } else {
        res.status(404).send({ message: 'Data not found.' });
    }

}

const editMsFacility = async (req, res) => {
    const id = req.params.id;
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const facilitys = req.body.map(
            facility => {
                return {
                    sequence: facility.sequence,
                    description: facility.description,
                    code: facility.code,
                    status: facility.status,
                    updatedBy: userId,
                }
            });
        const updatedData = await msFacilitiesModel.update(breakfasts, { where: { id: id } });

        if (updatedData[0] > 0) {
            res.status(200).send({ message: 'Data updated successfully.', data: updatedData });
        } else {
            res.status(404).send({ message: 'Could not update the data.' });
        }
    } else {
        res.status(500).send({ message: 'Bad Request Check Your Request' });
    }


}

const deleteMsFacility = async (req, res) => {
    const id = req.params.id;
    const deletedData = await msFacilitiesModel.destroy({ where: { id: id } });

    if (deletedData) {
        res.status(200).send({ message: 'Data deleted successfully.', data: deletedData });
    } else {
        res.status(404).send({ message: 'Data not deleted.' });
    }
}


module.exports = {
    addMsFacilities,
    getMsFacilities,
    getMsFacility,
    editMsFacility,
    deleteMsFacility,
}