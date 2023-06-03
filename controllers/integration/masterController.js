"use strict"

const chalk = require('chalk');
const { request } = require('express');
const db = require('../../config/sequelize');
const msHotelModel = db.masterHotel;
const AppError = require('../../utils/appError')
const crypto = require('crypto');

var axios = require('axios');
const { responseError, responseSuccess } = require('../../utils/response');

const syncHotel = async (req, res) => {
    try {
        const config = {
            method: 'post',
            url: `${process.env.JARVIS_URL}Hotel/GetHotelList`,
            data: {
                "Login": {
                    "AgencyCode": process.env.JARVIS_AGENCY_CODE,
                    "Username": process.env.JARVIS_USER,
                    "Password": process.env.JARVIS_PASS,
                },
                "Language": req.body.language,
                "Country": req.body.country,
                "City": req.body.city,
                "Hotels": {
                    "Code": [
                        req.body.codeHotel
                    ]
                },
                "FromDateTime": req.body.fromDate,
                "DetailLevel": req.body.detailLevel,
                "Xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "Xsd": "http://www.w3.org/2001/XMLSchema"
            },
            headers: {
                'Accept': 'application/json'
            }
        };

        axios(config)
            .then(data => {
                data?.data?.hotels?.hotel.forEach(async v => {
                    const currentHotel = await msHotelModel.findOne({ where: { code: v.code } })

                    const insertOrUpdate = {
                        countryCode: v.address?.countryCode,
                        cityCode: v.address?.cityCode,
                        locationCode: v.address?.continentCode,
                        name: v.name,
                        email: v.reservation?.email,
                        phone: v.reservation?.telephone,
                        website: v.webSite,
                        address: v.address?.line1,
                        zipCode: v.address?.zipCode,
                        latitude: v.geoLocation?.latitude,
                        longitude: v.geoLocation?.longitude,
                        checkInTime: v.checkInTime,
                        checkOutTime: v.checkOutTime,
                        star: v.rating,
                        totalRoom: v.noOfRooms,
                        status: 1,
                        createdBy: req.user.id,
                    }

                    if (currentHotel) {
                        await msHotelModel.update(insertOrUpdate, { where: { code: v.code } })
                    } else {
                        await msHotelModel.create({ ...insertOrUpdate, code: v.code })
                    }
                })

                res.status(200).send(responseSuccess('Integration successfully', data?.data?.hotels?.hotel))
            })
            .catch(error => {
                throw error
            });

    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const listHotels = async (req, res) => {
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const datas = req.body.map(
            response => {
                return {
                    language: response.language,
                    country: response.country,
                    city: response.city,
                    fromDate: response.fromDate,
                    detailLevel: response.detailLevel,
                    codeHotel: response.codeHotel
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
                "Language": datas[0].language,
                "Country": datas[0].country,
                "City": datas[0].city,
                "Hotels": {
                    "Code": [
                        datas[0].codeHotel
                    ]
                },
                "FromDateTime": datas[0].fromDate,
                "DetailLevel": datas[0].detailLevel,
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

const nationalities = async (req, res) => {
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const datas = req.body.map(
            response => {
                return {
                    checkOut: response.checkOut,
                    checkIn: response.checkIn,
                    nationality: response.nationality,
                    country: response.country,
                    city: response.city,
                    roomNo: response.roomNo,
                    codeHotel: response.codeHotel,
                    adults: response.adults,
                    children: response.children,
                    child1Age: response.child1Age,
                    child2Age: response.child2Age
                }
            });
        var config = {
            method: 'post',
            url: 'http://uat-jarvis1-xmlsell.mgbedbank.com/1.0/Hotel/SearchHotel',
            data: {
                "Login": {
                    "AgencyCode": "AGID024973",
                    "Username": "SentraVJ1",
                    "Password": "5eN74a!h0L!742Y"
                },
                "Nationality": datas[0].nationality,
                "Country": datas[0].country,
                "City": datas[0].city,
                "Hotels": {
                    "Code": [
                        datas[0].codeHotel,
                    ]
                },
                "CheckIn": datas[0].checkIn,
                "CheckOut": datas[0].checkOut,
                "Rooms": {
                    "Room": [
                        {
                            "RoomNo": datas[0].roomNo,
                            "NoOfAdults": datas[0].adults,
                            "NoOfChild": datas[0].children,
                            "Child1Age": "",
                            "Child2Age": "",
                            "ExtraBed": false
                        }
                    ]
                },
                "Currency": "IDR",
                "Language": "En",
                "AvailFlag": true,
                "MaxNoOfHotel": "",
                "DetailLevel": "FULL"
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
    listHotels,
    nationalities,
    syncHotel,
}