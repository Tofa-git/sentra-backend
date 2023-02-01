"use strict"

const chalk = require('chalk');
const { request } = require('express');
const db = require('../../config/sequelize');
const msBreakfastsModel = db.masterBreakfasts;
const AppError = require('../../utils/appError')


const addMsBreakfasts = async (req, res) => {

    const { sequence, description, status } = req.body;
    const breakfast = {
        sequence, description, status
    }

    if (req.body && Array.isArray(req.body)) {
        const breakfasts = req.body.map(
            breakfast => {
                return {
                    sequence: breakfast.sequence ?? 0,
                    description: breakfast.description,
                    status: 1,
                }
            });
        await msBreakfastsModel.bulkCreate(breakfasts);

        if (addedProduct) {
            res.status(201).send({ message: 'Master Breakfast added successfully.', data: addedProduct });
        } else {
            res.status(404).send({ message: 'Could not add master breakfast.' });
        }
    }else{
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
    const breakfast = await msBreakfastsModel.findAll({
        attributes: [
            'id',
            'sequence',
            'description',
            'status'
        ],
        offset: pageOffset,
        limit: pageSize,
    });

    if (breakfast.length > 0) {
        res.status(200).send({ message: 'Master Breakfast found.', data: breakfast });
    } else {
        res.status(404).send({ message: 'Master Breakfast not found.' });
    }

}

const getMsBreakfast = async (req, res) => {
    const id = req.params.id;
    const breakfast = await msBreakfastsModel.findOne({
        attributes: ['id', 'sequence', 'description', 'status'],
        where: {
            id: id
        }
    });

    if (breakfast) {
        res.status(200).send({ message: 'Master Breakfast found.', data: breakfast });
    } else {
        res.status(404).send({ message: 'Master Breakfast not found.' });
    }

}

const editMsBreakfast = async (req, res) => {
    const id = req.params.id;
    if (req.body && Array.isArray(req.body)) {
        const breakfasts = req.body.map(
            breakfast => {
                return {
                    sequence: breakfast.sequence,
                    description: breakfast.description,
                    status: breakfast.status,
                }
            });
        const updatedProduct = await msBreakfastsModel.update(breakfasts, { where: { id: id } });

        if (updatedProduct[0] > 0) {
            res.status(200).send({ message: 'Master Breakfast updated successfully.', data: updatedProduct });
        } else {
            res.status(404).send({ message: 'Could not update Master Breakfast.' });
        }
    }else{
        res.status(500).send({ message: 'Bad Request Check Your Request' });
    }


}

const deleteMsBreakfast = async (req, res) => {
    const id = req.params.id;
    const deletedProduct = await productModel.destroy({ where: { id: id } });

    if (deletedProduct) {
        res.status(200).send({ message: 'Master Breakfast deleted successfully.', data: deletedProduct });
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