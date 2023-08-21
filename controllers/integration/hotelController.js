
"use strict"

const db = require('../../config/sequelize');
const bookingModel = db.booking;
const bookingGuestModel = db.bookingGuest;
const crypto = require('crypto');
const { Op } = require('sequelize');
const { paginattionGenerator } = require('../../utils/pagination');
const moment = require('moment/moment');

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
                    let hotels = data?.data?.hotels?.hotel;
                    hotels.map(h => {
                        h.roomDetails.map((r, ri) => {
                            r.id = (ri + 1)
                        })
                    })

                    res.status(200).send(responseSuccess('success', {
                        sessionId: data?.data?.sessionID,
                        hotels,
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
                    bookingModel.create({
                        mgBookingID: data?.data?.bookingDetails.mgBookingID,
                        agencyBookingID: data?.data?.bookingDetails.agencyBookingID,
                        mgBookingVersionID: data?.data?.bookingDetails.mgBookingVersionID,
                        agencyVoucherNo: data?.data?.bookingDetails.agencyVoucherNo,
                        agencyVoucherDate: data?.data?.bookingDetails.agencyVoucherDate,
                        hotelCode: data?.data?.bookingDetails.hotels.hotel.code,
                        hotelName: data?.data?.bookingDetails.hotels.hotel.name,
                        roomCode: data?.data?.bookingDetails.hotels.hotel.roomDetails.code,
                        roomName: data?.data?.bookingDetails.hotels.hotel.roomDetails.name,
                        checkIn: req.body.checkIn,
                        checkOut: req.body.checkOut,
                        mealPlan: req.body.mealPlan,
                        cancellationPolicyType: req.body.cancelPolicyType,
                        netPrice: parseInt(data?.data?.bookingDetails.hotels.hotel.roomDetails.netPrice),
                        grossPrice: parseInt(data?.data?.bookingDetails.hotels.hotel.roomDetails.grossPrice),
                        createdBy: req.user.id,
                        status: 1,
                        roomDetail: JSON.stringify(req.body.roomDetail),
                        additionalRequest: JSON.stringify(req.body.additionalRequest),
                    });

                    let guests = [];
                    req.body.guests.map(v => {
                        guests.push({
                            ...v,
                            mgBookingID: data?.data?.bookingDetails.mgBookingID,
                            createdBy: req.user.id,
                        });
                    })
                    bookingGuestModel.bulkCreate(guests);

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

const bookingList = async (req, res) => {
    try {
        const query = await bookingModel.findAndCountAll({
            attributes: [
                'id',
                'mgBookingID',
                'mgBookingVersionID',
                'agencyVoucherNo',
                'agencyVoucherDate',
                'hotelCode',
                'hotelName',
                'roomCode',
                'roomName',
                'checkIn',
                'checkOut',
                'mealPlan',
                'cancellationPolicyType',
                'netPrice',
                'grossPrice',
                'createdAt',
            ],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
            where: {
                mgBookingID: {
                    [Op.like]: ['%' + (req.query.mgBookingID ?? '') + '%'],
                },
                status: 1,
            }
        });

        const data = paginattionGenerator(req, query);

        res.status(200).send(responseSuccess('Success', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const bookingDetail = async (req, res) => {
    try {
        const config = {
            method: 'post',
            url: `${process.env.JARVIS_URL}Hotel/GetRSVNDetails`,
            data: {
                "Login": {
                    "AgencyCode": process.env.JARVIS_AGENCY_CODE,
                    "Username": process.env.JARVIS_USER,
                    "Password": process.env.JARVIS_PASS,
                },
                "MGBookingID": req.params.id,
                "AgencyBookingID": "",
                "Language": "EN",
                "DetailLevel": "FULL"
            },
            headers: {
                'Accept': 'application/json'
            }
        };

        axios(config)
            .then(async function (data) {
                if (data.data.status) {
                    const [local] = await db.sequelize.query(`
                        SELECT
                            b.id bookingId,
                            b.mgBookingID bookingMgBookingID,
                            b.mgBookingVersionID bookingMgBookingVersionID,
                            b.agencyVoucherNo bookingAgencyVoucherNo,
                            b.agencyVoucherDate bookingAgencyVoucherDate,
                            b.hotelCode bookingHotelCode,
                            b.hotelName bookingHotelName,
                            b.roomCode bookingRoomCode,
                            b.roomName bookingRoomName,
                            b.checkIn bookingCheckIn,
                            b.checkOut bookingCheckOut,
                            b.mealPlan bookingMealPlan,
                            b.cancellationPolicyType bookingCancellationPolicyType,
                            b.netPrice bookingNetPrice,
                            b.grossPrice bookingGrossPrice,
                            b.chargeNetPrice bookingChargeNetPrice,
                            b.chargeGrossPrice bookingChargeGrossPrice,
                            b.createdAt bookingCreatedAt,
                            b.status bookingStatus,
                            b.roomDetail bookingRoomDetail,
                            b.additionalRequest bookingAdditionalRequest,
                            h.countryId hotelCountryCode,
                            h.cityId hotelCityCode,
                            h.locationCode hotelLocationCode,
                            h.name hotelName,
                            h.code hotelCode,
                            h.email hotelEmail,
                            h.phone hotelPhone,
                            h.website hotelWebsite,
                            h.address hotelAddress,
                            h.zipCode hotelZipCode,
                            h.latitude hotelLatitude,
                            h.longitude hotelLongitude,
                            h.checkInTime hotelCheckInTime,
                            h.checkOutTime hotelCheckOutTime,
                            h.extra hotelExtra,
                            h.star hotelStar,
                            h.totalRoom hotelTotalRoom,
                            h.status hotelStatus,
                            co.name hotelCountry,
                            ci.long_name hotelCity,
                            l.name hotelLocation,
                            u.id userId,
                            u.firstName userFirstName,
                            u.lastName userLastName,
                            u.email userEmail,
                            u.mobile userMobile,
                            u.address userAddress,
                            u.image userImage
                        FROM bookings b
                        INNER JOIN ms_hotels h ON h.code = b.hotelCode
                        INNER JOIN users u ON u.id = b.createdBy
                        LEFT JOIN country_code co ON co.isoId COLLATE utf8mb4_general_ci = h.countryId
                        LEFT JOIN city_code ci ON ci.code COLLATE utf8mb4_general_ci = h.cityId
                        LEFT JOIN city_location l ON l.code = h.locationCode
                        WHERE b.mgBookingID = '${req.params.id}'
                            AND b.status = '1'
                    `);

                    const guests = await bookingGuestModel.findAll({ where: { mgBookingID: req.params.id } })

                    res.status(200).send(responseSuccess('successfully retrieving', {
                        ...data?.data?.bookingDetails,
                        local: {
                            ...local[0],
                            bookingRoomDetail: JSON.parse(local[0].bookingRoomDetail),
                            bookingAdditionalRequest: JSON.parse(local[0].bookingAdditionalRequest),
                            guests,
                        },
                    }))
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

const bookingCancel = async (req, res) => {
    try {
        const config = {
            method: 'post',
            url: `${process.env.JARVIS_URL}Hotel/CancelReservation`,
            data: {
                "Login": {
                    "AgencyCode": process.env.JARVIS_AGENCY_CODE,
                    "Username": process.env.JARVIS_USER,
                    "Password": process.env.JARVIS_PASS,
                },
                "MGBookingID": req.params.id,
                "AgencyBookingID": "",
                "SimulationFlag": false,
                "CancelDate": moment().format('YYYY-MM-DD'),
                "Language": "EN",
                "DetailLevel": "FULL"
            },
            headers: {
                'Accept': 'application/json'
            }
        };

        axios(config)
            .then(function (data) {
                if (data.data.status) {
                    res.status(200).send(responseSuccess('successfully cancel', data?.data?.bookingDetails))
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
    bookingHotels,
    bookingList,
    bookingDetail,
    bookingCancel,
}