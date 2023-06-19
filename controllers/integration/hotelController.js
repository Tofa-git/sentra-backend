
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
                        req.body.codeHotel,
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
            .then(data => {
                console.log(data)
                
                if (data.data.status) {
                    res.status(200).send(responseSuccess('Integration successfully',  data?.data?.hotels?.hotel))
                } else {
                    res.status(data.status).send(responseError(data.data.errorMessage))
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

                    codeRoom:response.codeRoom,
                    codeHotel: response.codeHotel,
                    mealPlan:response.mealPlan,

                    adults: response.adults,
                    children: response.children,
                    child1Age: response.child1Age,
                    child2Age: response.child2Age,

                    sessionId:response.sessionId,
                    rateKey:response.rateKey,
                }
            });
        var config = {
            method: 'post',
            url: 'http://uat-jarvis1-xmlsell.mgbedbank.com/1.0/Hotel/RecheckHotel',
            data: {
                "Login": {
                    "AgencyCode": "AGID024973",
                    "Username": "SentraVJ1",
                    "Password": "5eN74a!h0L!742Y"
                },
                "SessionID": datas[0].sessionId,
                "Nationality": datas[0].nationality,
                "Country": datas[0].country,
                "City": datas[0].city,
                "CheckIn": datas[0].checkIn,
                "CheckOut": datas[0].checkOut,
                "HotelCode": datas[0].codeHotel,
                "RoomDetails": {
                    "Code": datas[0].codeRoom,
                    "MealPlan": datas[0].mealPlan,
                    "CancellationPolicyType": "Flexi",
                    "PackageRate": false
                },
                "Rooms": {
                    "Room": [
                        {
                            "RoomNo": datas[0].roomNo,
                            "NoOfAdults": datas[0].adults,
                            "NoOfChild": datas[0].children,
                            "Child1Age": datas[0].child1Age,
                            "Child2Age": datas[0].child2Age,
                            "ExtraBed": false,
                            "RateKey": datas[0].rateKey
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

const bookingHotels = async (req, res) => {
    // Extract userId from JWT token
    const userId = req.user.id;

    if (req.body && Array.isArray(req.body)) {
        const AgencyBookingID = crypto.randomBytes(16).toString("hex");

        const datas = req.body.map(
            response => {
                return {

                    checkOut: response.checkOut,
                    checkIn: response.checkIn,
                    nationality: response.nationality,                    

                    roomNo: response.roomNo,
                    mealPlan: response.mealPlan,
                    cancelPolicyType: response.cancelPolicyType,

                    codeHotel: response.codeHotel,
                    codeRoom: response.codeRoom,
                    roomNo:response.roomNo,
                    adults: response.adults,
                    children: response.children,
                    
                    sessionId:response.sessionId,
                    rateKey:response.rateKey,
                }
            });

        var user = {
            "Salutation": " Mr.",
            "FirstName": "Peter",
            "LastName": "Smith",
            "Age": "20"
        };

        var config = {
            method: 'post',
            url: 'http://uat-jarvis1-xmlsell.mgbedbank.com/1.0/Hotel/BookHotel',
            data: {
                "Login": {
                    "AgencyCode": "AGID024973",
                    "Username": "SentraVJ1",
                    "Password": "5eN74a!h0L!742Y"
                },
                "SessionID": datas[0].sessionId,
                "AgencyBookingID": AgencyBookingID,
                "Nationality": datas[0].nationality,
                "CheckIn": datas[0].checkIn,
                "CheckOut": datas[0].checkOut,
                "HotelCode": datas[0].codeHotel,
                "RoomDetails": {
                    "Code": datas[0].codeRoom,
                    "MealPlan": datas[0].mealPlan,
                    "CancellationPolicyType": datas[0].cancelPolicyType,
                    "PackageRate": false
                },
                "Rooms": {
                    "Room": [
                        {
                            "PaxDetails": {
                                "Pax": [
                                    user,
                                    user
                                ]
                            },
                            "RoomNo": datas[0].roomNo,
                            "NoOfAdults": datas[0].adults,
                            "NoOfChild": datas[0].children,
                            "ExtraBed": false,
                            "RateKey": datas[0].rateKey
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
    searchHotels,
    recheckHotels,
    bookingHotels      
}