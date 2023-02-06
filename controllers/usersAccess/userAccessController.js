"use strict"

const chalk = require('chalk');
const { request } = require('express');
const db = require('../../config/sequelize');
const msAccess = db.masterBreakfasts;
const AppError = require('../../utils/appError')

const checkAccess = async (req, res, next) => {
    if (!req.query.size || !req.query.page) return res.status(500).send({ message: 'page number and page size are required !' })
    let pageSize = +req.query.size;
    if (pageSize > 100) {
        pageSize = 100;
    }
    let pageOffset = ((+req.query.page - 1) * +req.query.size);
    const data = await msAccess.findAll({
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
        res.status(200).send({ message: 'Data found.', data: data });
    } else {
        res.status(404).send({ message: 'Data not found.' });
    }
}

const getUserMenu = async (req, res, next) => {
    if (!req.query.size || !req.query.page) return res.status(500).send({ message: 'page number and page size are required !' })
    let pageSize = +req.query.size;
    if (pageSize > 100) {
        pageSize = 100;
    }
    let pageOffset = ((+req.query.page - 1) * +req.query.size);
    const data = await msAccess.findAll({
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
        res.status(200).send({ message: 'Data found.', data: data });
    } else {
        res.status(404).send({ message: 'Data not found.' });
    }
}

const getAccess = async (req, res, next) => {
    if (!req.query.size || !req.query.page) return res.status(500).send({ message: 'page number and page size are required !' })
    let pageSize = +req.query.size;
    if (pageSize > 100) {
        pageSize = 100;
    }
    let pageOffset = ((+req.query.page - 1) * +req.query.size);
    const data = await msAccess.findAll({
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
        res.status(200).send({ message: 'Data found.', data: data });
    } else {
        res.status(404).send({ message: 'Data not found.' });
    }
}

module.exports = {
    checkAccess,
    getUserMenu,
    getAccess,
}