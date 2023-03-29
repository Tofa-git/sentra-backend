"use strict"

const chalk = require('chalk');
const { request } = require('express');
const db = require('../../config/sequelize');
const msHotelModel = db.masterHotel;
const AppError = require('../../utils/appError')
const crypto = require('crypto');

var axios = require('axios');

const rsvnList = async (req, res) => {
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const datas = req.body.map(
            response => {
                return {

                }
            });
        var config = {
            method: 'post',
            url: 'http://uat-jarvis1-xmlsell.mgbedbank.com/1.0/Hotel/GetHotelList',
            data: {
                "Login": {
                    "AgencyCode": "AGID024973",
                    "Username": "SentraVJ1",
                    "Password": "5eN74a!h0L!742Y"
                },
                "Language": language,
                "Country": country,
                "City": city,
                "Hotels": {
                    "Code": [
                        codeHotel
                    ]
                },
                "FromDateTime": fromDate,
                "DetailLevel": detailLevel,
                "Xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "Xsd": "http://www.w3.org/2001/XMLSchema"
            },
            headers: {
                'Accept': 'application/json'
            }
        };

        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                res.status(201).send({ data: response.data, message: 'Integration successfully' });
            })
            .catch(function (error) {
                console.log(error);
            });


    } else {
        res.status(500).send({ message: 'Bad Request Check Your Request' });
    }
}

const rsvnDetails = async (req, res) => {
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const datas = req.body.map(
            response => {
                return {

                }
            });
        var config = {
            method: 'post',
            url: 'http://uat-jarvis1-xmlsell.mgbedbank.com/1.0/Hotel/GetHotelList',
            data: {
                "Login": {
                    "AgencyCode": "AGID024973",
                    "Username": "SentraVJ1",
                    "Password": "5eN74a!h0L!742Y"
                },
                "Language": language,
                "Country": country,
                "City": city,
                "Hotels": {
                    "Code": [
                        codeHotel
                    ]
                },
                "FromDateTime": fromDate,
                "DetailLevel": detailLevel,
                "Xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "Xsd": "http://www.w3.org/2001/XMLSchema"
            },
            headers: {
                'Accept': 'application/json'
            }
        };

        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                res.status(201).send({ data: response.data, message: 'Integration successfully' });
            })
            .catch(function (error) {
                console.log(error);
            });


    } else {
        res.status(500).send({ message: 'Bad Request Check Your Request' });
    }
}

const rsvnCancel = async (req, res) => {
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const datas = req.body.map(
            response => {
                return {

                }
            });
        var config = {
            method: 'post',
            url: 'http://uat-jarvis1-xmlsell.mgbedbank.com/1.0/Hotel/GetHotelList',
            data: {
                "Login": {
                    "AgencyCode": "AGID024973",
                    "Username": "SentraVJ1",
                    "Password": "5eN74a!h0L!742Y"
                },
                "Language": language,
                "Country": country,
                "City": city,
                "Hotels": {
                    "Code": [
                        codeHotel
                    ]
                },
                "FromDateTime": fromDate,
                "DetailLevel": detailLevel,
                "Xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "Xsd": "http://www.w3.org/2001/XMLSchema"
            },
            headers: {
                'Accept': 'application/json'
            }
        };

        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                res.status(201).send({ data: response.data, message: 'Integration successfully' });
            })
            .catch(function (error) {
                console.log(error);
            });


    } else {
        res.status(500).send({ message: 'Bad Request Check Your Request' });
    }
}

module.exports = {
    rsvnDetails,
    rsvnCancel 
}
