"use strict"

const chalk = require('chalk');
const { request } = require('express');
const db = require('../../config/sequelize');
const msHotelModel = db.masterHotel;
const AppError = require('../../utils/appError')
var axios = require('axios');

const addMsHotels = async (req, res) => {
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const datas = req.body.map(
            response => {
                return {
                    countryId: response.countryId,
                    cityId: response.cityId,
                    locationId: response.locationId,
                    sequence: response.sequence,
                    name: response.name,
                    email: response.email,
                    bqEmail: response.bqEmail,
                    ccEmail: response.ccEmail,
                    phone: response.phone,
                    fax: response.fax,
                    website: response.website,
                    youtube: response.youtube,
                    address: response.address,
                    zipCode: response.zipCode,
                    latitude: response.latitude,
                    longitude: response.longitude,
                    starType: response.starType,
                    totalRoom: response.totalRoom,
                    event: response.event,
                    manager: response.manager,
                    internalRemark: response.internalRemark,
                    status: 1,
                    createdBy: userId,
                }
            });
            var config = {
                method: 'post',
                url: 'http://uat-jarvis1-xmlsell.mgbedbank.com/1.0/hotel/GetHotelList',
                data: {
                    "Login": {
                        "AgencyCode": "AGID024973",
                        "Username": "SentraVJ1",
                        "Password": "5eN74a!h0L!742Y"
                    },
                    "Language": "EN",
                    "Country": "ID",
                    "City": "ID-DPS",
                    "Hotels": {
                        "Code": [
                            ""
                        ]
                    },
                    "FromDateTime": "2019-05-16 00:00:00",
                    "DetailLevel": "full",
                    "Xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "Xsd": "http://www.w3.org/2001/XMLSchema"
                },
                headers: {
                    'Accept': 'application/json'
                }
            };
    
            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    res.status(201).send({ data: response.data, message: 'Data created successfully' });
                })
                .catch(function (error) {
                    console.log(error);
                });
    

        // await msHotelModel.bulkCreate(datas).then(data => {
        //     res.status(201).send({ data: data, message: 'Data created successfully' });
        // })
        //     .catch(err => {
        //         res.status(500).send({
        //             data: null,
        //             message:
        //                 err.message =
        //                 "Validation Error" ? err.message : "Some error occurred while creating the data."
        //         });
        //     });
    } else {
        res.status(500).send({ message: 'Bad Request Check Your Request' });
    }
}



const getMsHotels = async (req, res, next) => {
    if (!req.query.size || !req.query.page) return res.status(500).send({ message: 'page number and page size are required !' })
    let pageSize = +req.query.size;
    if (pageSize > 100) {
        pageSize = 100;
    }
    let pageOffset = ((+req.query.page - 1) * +req.query.size);
    const data = await msHotelModel.findAll({
        data: [
            'id',
            'countryId',
            'cityId',
            'locationId',
            'sequence',
            'name',
            'email',
            'bqEmail',
            'ccEmail',
            'phone',
            'fax',
            'website',
            'youtube',
            'address',
            'zipCode',
            'latitude',
            'longitude',
            'starType',
            'totalRoom',
            'event',
            'manager',
            'internalRemark',
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

const getMsHotel = async (req, res) => {
    const id = req.params.id;
    const data = await msHotelModel.findOne({
        attributes: [
            'id',
            'countryId',
            'cityId',
            'locationId',
            'sequence',
            'name',
            'email',
            'bqEmail',
            'ccEmail',
            'phone',
            'fax',
            'website',
            'youtube',
            'address',
            'zipCode',
            'latitude',
            'longitude',
            'starType',
            'totalRoom',
            'event',
            'manager',
            'internalRemark',
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

const editMsHotel = async (req, res) => {
    const id = req.params.id;
    // Extract userId from JWT token
    const userId = req.user.id;
    if (req.body && Array.isArray(req.body)) {
        const datas = req.body.map(
            response => {
                return {
                    countryId: response.countryId,
                    cityId: response.cityId,
                    locationId: response.locationId,
                    sequence: response.sequence,
                    name: response.name,
                    email: response.email,
                    bqEmail: response.bqEmail,
                    ccEmail: response.ccEmail,
                    phone: response.phone,
                    fax: response.fax,
                    website: response.website,
                    youtube: response.youtube,
                    address: response.address,
                    zipCode: response.zipCode,
                    latitude: response.latitude,
                    longitude: response.longitude,
                    starType: response.starType,
                    totalRoom: response.totalRoom,
                    event: response.event,
                    manager: response.manager,
                    internalRemark: response.internalRemark,
                    status: 1,
                    createdBy: userId,
                }
            });
        const updatedData = await msHotelModel.update(datas, { where: { id: id } });

        if (updatedData[0] > 0) {
            res.status(200).send({ message: 'Success Updated the data.', data: updatedData });
        } else {
            res.status(404).send({ message: 'Could not update the data.' });
        }
    } else {
        res.status(500).send({ message: 'Bad Request Check Your Request' });
    }


}


const deleteMsHotel = async (req, res) => {
    const id = req.params.id;
    const deletedData = await msHotelModel.destroy({ where: { id: id } });

    if (deletedData) {
        res.status(200).send({ message: 'The data deleted successfully.', data: deletedData });
    } else {
        res.status(404).send({ message: 'The data not deleted.' });
    }
}


module.exports = {
    addMsHotels,
    getMsHotels,
    getMsHotel,
    editMsHotel,    
    deleteMsHotel
}