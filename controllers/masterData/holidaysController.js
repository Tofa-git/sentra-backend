"use strict"

const moment = require('moment/moment');
const db = require('../../config/sequelize');
const { responseSuccess, responseError } = require('../../utils/response');
const holidayModel = db.holiday;

const list = async (req, res) => {
    try {
        const data = await holidayModel.findAll({
            attributes: [
                'id',
                'date',
                'isHoliday',
            ],
            where: db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('date')), req.query.year || moment().year())
        });

        res.status(200).send(responseSuccess('Success', data));
    } catch (error) {
        console.log(error)
        res.status(500).send(responseError(error))
    }
}

const update = async (req, res) => {
    try {
        req.body.forEach(async v => {
            await holidayModel.update({
                isHoliday: v.isHoliday,
            }, { where: { id: v.id } })
        })

        res.status(200).send(responseSuccess('Data updated successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}


module.exports = {
    list,
    update,
}