"use strict"

const fs = require('fs');
const db = require('../../config/sequelize');
const { responseSuccess, responseError } = require('../../utils/response');
const fileModel = db.file;

const create = async (req, res) => {
    try {
        let creates = [];
        req.body.image.map(v => {
            // to declare some path to store your converted image
            const url = '/images/hotel/' + Date.now() + '.png'

            // to convert base64 format into random filename
            const base64Data = v.replace(/^data:([A-Za-z-+/]+);base64,/, '');

            fs.writeFileSync('./public' + url, base64Data, { encoding: 'base64' });
            console.log(__dirname)

            creates.push({
                url,
                type: 'photo',
                createdBy: req.user.id,
            })
        })

        const origin = req.protocol + "://" + req.get('host')
        const data = await fileModel.bulkCreate(creates)
        data.forEach(v => {
            v.url = origin + v.url;
        })

        res.status(201).send(responseSuccess('Data created successfully', data));
    } catch (error) {
        console.log(error)
        res.status(500).send(responseError(error));
    }
}

const destroy = async (req, res) => {
    try {
        const file = await fileModel.findOne({ where: { id: req.params.id } });
        fs.unlinkSync('./public' + file.url);
        file.destroy();

        res.status(200).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}


module.exports = {
    create,
    destroy,
}