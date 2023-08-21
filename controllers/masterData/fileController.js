"use strict"

const fs = require('fs');
const path = require('path');
const db = require('../../config/sequelize');
const { responseSuccess, responseError } = require('../../utils/response');
const fileModel = db.file;

const create = async (req, res) => {
    try {
        let creates = [];

        if (!Array.isArray(req.body.image)) {
            // Handle the case when req.body.image is not an array
            console.log("Invalid Image data")
            return res.status(400).send(responseError('Invalid image data'));
        }
        req.body.image.map(v => {
            // to declare some path to store your converted image
            const url = '/images/hotel/' + Date.now() + '.png'

            // Get the directory path
            const directory = path.dirname('./public' + url);

            // Create the directory if it doesn't exist
            if (!fs.existsSync(directory)) {                
                fs.mkdirSync(directory, { recursive: true });
            }


            // to convert base64 format into random filename
            const base64Data = v.replace(/^data:([A-Za-z-+/]+);base64,/, '');

            fs.writeFileSync('./public' + url, base64Data, { encoding: 'base64' });            

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