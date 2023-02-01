"use strict"

const chalk = require('chalk');
const { request } = require('express');
const db = require('../../config/sequelize');
const msBreakfastsModel = db.masterBreakfasts;
const AppError = require('../../utils/appError')


const addMsBreakfasts = async (req, res) => {
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const datas = req.body.map(
            breakfast => {
                return {
                    sequence: breakfast.sequence ?? 0,
                    description: breakfast.description,
                    status: 1,
                    createdBy:userId,
                }
            });
        
        await msBreakfastsModel.bulkCreate(datas).then(data => {
            res.status(201).send({ data: data, message: 'Ms Breakfast created successfully' });
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

const getMsBreakfasts = async (req, res, next) => {
    if (!req.query.size || !req.query.page) return res.status(500).send({ message: 'page number and page size are required !' })
    let pageSize = +req.query.size;
    if (pageSize > 100) {
        pageSize = 100;
    }
    let pageOffset = ((+req.query.page - 1) * +req.query.size);
    const data = await msBreakfastsModel.findAll({
        data: [
            'id',
            'sequence',
            'description',
            'status'
        ],
        offset: pageOffset,
        limit: pageSize,
    });

    if (data.length > 0) {
        res.status(200).send({ message: 'Master Breakfast found.', data: data });
    } else {
        res.status(404).send({ message: 'Master Breakfast not found.' });
    }

}

const getMsBreakfast = async (req, res) => {
    const id = req.params.id;
    const data = await msBreakfastsModel.findOne({
        attributes: ['id', 'sequence', 'description', 'status'],
        where: {
            id: id
        }
    });

    if (data) {
        res.status(200).send({ message: 'Master Breakfast found.', data: data });
    } else {
        res.status(404).send({ message: 'Master Breakfast not found.' });
    }

}

const editMsBreakfast = async (req, res) => {
    const id = req.params.id;
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const breakfasts = req.body.map(
            breakfast => {
                return {
                    sequence: breakfast.sequence,
                    description: breakfast.description,
                    status: breakfast.status,
                    updatedBy:userId,
                }
            });
        const updatedData = await msBreakfastsModel.update(breakfasts, { where: { id: id } });

        if (updatedData[0] > 0) {
            res.status(200).send({ message: 'Master Breakfast updated successfully.', data: updatedData });
        } else {
            res.status(404).send({ message: 'Could not update Master Breakfast.' });
        }
    } else {
        res.status(500).send({ message: 'Bad Request Check Your Request' });
    }


}

const deleteMsBreakfast = async (req, res) => {
    const id = req.params.id;
    const deletedData = await msBreakfastsModel.destroy({ where: { id: id } });

    if (deletedData) {
        res.status(200).send({ message: 'Master Breakfast deleted successfully.', data: deletedData });
    } else {
        res.status(404).send({ message: 'Master Breakfast not deleted.' });
    }
}


module.exports = {
    addMsBreakfasts,
    getMsBreakfasts,
    getMsBreakfast,
    editMsBreakfast,
    deleteMsBreakfast
}