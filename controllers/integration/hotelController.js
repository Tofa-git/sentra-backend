
"use strict"

const chalk = require('chalk');
const { request } = require('express');
const db = require('../../config/sequelize');
const msHotelModel = db.masterHotel;
const AppError = require('../../utils/appError')
const crypto = require('crypto');

var axios = require('axios');
const { responseSuccess, responseError } = require('../../utils/response');

const searchHotels = async (req, res) => {
    try {
        const config = {
            method: 'post',
            url: `${process.env.JARVIS_URL}Hotel/SearchHotel`,
            data: {
                "Login": {
                    "AgencyCode": process.env.JARVIS_AGENCY_CODE,
                    "Username": process.env.JARVIS_USER,
                    "Password": process.env.JARVIS_PASS,
                },
                "Nationality": req.body.nationality,
                "Country": req.body.country,
                "City": req.body.city,
                "Hotels": {
                    "Code": [
                        req.body.hotelCode,
                    ]
                },
                "CheckIn": req.body.checkIn,
                "CheckOut": req.body.checkOut,
                "Rooms": {
                    "Room": [
                        {
                            "RoomNo": req.body.roomNo,
                            "NoOfAdults": req.body.adults,
                            "NoOfChild": req.body.children,
                            "Child1Age": req.body.child1Age,
                            "Child2Age": req.body.child2Age,
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
            .then(data => {
                if (data.data.status) {
                    res.status(200).send(responseSuccess('success', {
                        sessionId: data?.data?.sessionID,
                        hotels: data?.data?.hotels?.hotel,
                    }))
                } else {
                    res.status(500).send(responseError(data.data.errorMessage))
                }
            })
            .catch(error => {
                throw error
            });

    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const recheckHotels = async (req, res) => {
    try {
        const config = {
            method: 'post',
            url: `${process.env.JARVIS_URL}Hotel/RecheckHotel`,
            data: {
                "Login": {
                    "AgencyCode": process.env.JARVIS_AGENCY_CODE,
                    "Username": process.env.JARVIS_USER,
                    "Password": process.env.JARVIS_PASS,
                },
                "SessionID": req.body.sessionId,
                "Nationality": req.body.nationality,
                "Country": req.body.country,
                "City": req.body.city,
                "CheckIn": req.body.checkIn,
                "CheckOut": req.body.checkOut,
                "HotelCode": req.body.hotelCode,
                "RoomDetails": {
                    "Code": req.body.roomCode,
                    "MealPlan": req.body.mealPlan,
                    "CancellationPolicyType": req.body.cancelPolicyType,
                    "PackageRate": false
                },
                "Rooms": {
                    "Room": [
                        {
                            "RoomNo": req.body.roomNo,
                            "NoOfAdults": req.body.adults,
                            "NoOfChild": req.body.children,
                            "Child1Age": req.body.child1Age,
                            "Child2Age": req.body.child2Age,
                            "ExtraBed": false,
                            "RateKey": req.body.rateKey
                        }
                    ]
                },
                "Currency": "IDR",
                "Language": "EN",
                "AvailFlag": true,
                "DetailLevel": "FULL"
            },
            headers: {
                'Accept': 'application/json'
            }
        };

        axios(config)
            .then(function (data) {
                if (data.data.status) {
                    res.status(200).send(responseSuccess('successfully recheck', data?.data?.hotels?.hotel))
                } else {
                    res.status(500).send(responseError(data.data.errorMessage))
                }
            })
            .catch(function (error) {
                throw error
            });

    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const bookingHotels = async (req, res) => {
    try {
        const config = {
            method: 'post',
            url: `${process.env.JARVIS_URL}Hotel/BookHotel`,
            data: {
                "Login": {
                    "AgencyCode": process.env.JARVIS_AGENCY_CODE,
                    "Username": process.env.JARVIS_USER,
                    "Password": process.env.JARVIS_PASS,
                },
                "SessionID": req.body.sessionId,
                "AgencyBookingID": crypto.randomBytes(16).toString("hex"),
                "Nationality": req.body.nationality,
                "CheckIn": req.body.checkIn,
                "CheckOut": req.body.checkOut,
                "HotelCode": req.body.hotelCode,
                "RoomDetails": {
                    "Code": req.body.roomCode,
                    "MealPlan": req.body.mealPlan,
                    "CancellationPolicyType": req.body.cancelPolicyType,
                    "PackageRate": false
                },
                "Rooms": {
                    "Room": [
                        {
                            "PaxDetails": {
                                "Pax": req.body.guests
                            },
                            "RoomNo": req.body.roomNo,
                            "NoOfAdults": req.body.adults,
                            "NoOfChild": req.body.children,
                            "ExtraBed": false,
                            "RateKey": req.body.rateKey
                        }
                    ]
                },
                "Currency": "IDR",
                "Language": "ID",
                "AvailFlag": true,
                "OnHold": false,
                "SpecialReq": "",
                "DetailLevel": "FULL"
            },
            headers: {
                'Accept': 'application/json'
            }
        };

        axios(config)
            .then(function (data) {
                if (data.data.status) {
                    res.status(200).send(responseSuccess('successfully book', data?.data?.bookingDetails))
                } else {
                    res.status(500).send(responseError(data.data.errorMessage))
                }
            })
            .catch(function (error) {
                throw error
            });

    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

module.exports = {
    searchHotels,
    recheckHotels,
    bookingHotels
}