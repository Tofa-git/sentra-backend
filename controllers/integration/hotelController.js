
"use strict"

const db = require('../../config/sequelize');
const bookingModel = db.booking;
const bookingGuestModel = db.bookingGuest;
const crypto = require('crypto');
const { Op } = require('sequelize');
const { paginattionGenerator } = require('../../utils/pagination');
const supplierModel = db.supplier;
const supplierApiModel = db.supplierApi;
const countryDataModel = db.countryCode;
const cityDataModel = db.cityCode;
const mappingCityModel = db.mappingCity;
const mappingCountryModel = db.mappingCountry;
const mappingHotelModel = db.mappingHotel;
const moment = require('moment/moment');
const generalConfig = require('../../config/generalConfig');

var axios = require('axios');
const { responseSuccess, responseError } = require('../../utils/response');

const searchHotels = async (req, res) => {
    try {
        const supplierId = req.body?.supplierId;
        const newHotelObjects = [];
        const whereConditions = {
            name: 'Search'
        };
        const loading = true;

        // Add supplierId to whereConditions if it exists in req.body
        if (supplierId) {
            whereConditions.supplierId = supplierId;
        }

        const data = await supplierApiModel.findAll({
            attributes: ['id', 'supplierId', 'name', 'url', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            where: whereConditions,
        });

        if (!data || data.length === 0) {
            return res.status(404).send(responseError('Data not found.'));
        }

        // Decrypt the encrypted attributes for each data entry
        const decryptedData = data.map((entry) => {
            return {
                id: entry.id,
                supplierId: entry.supplierId,
                name: entry.name,
                endpoint: generalConfig.decryptData(entry.endpoint),
                url: generalConfig.decryptData(entry.url),
                method: entry.method,
                code: generalConfig.decryptData(entry.code),
                user: generalConfig.decryptData(entry.user),
                password: generalConfig.decryptData(entry.password),
                body: generalConfig.decryptData(entry.body),
                status: entry.status,
            };
        });

        // Check if responseData.body is an array
        if (Array.isArray(decryptedData)) {
            // Use Promise.all to await all async operations
            await Promise.all(decryptedData.map(async (item) => {

                const supplierData = await supplierModel.findOne({
                    where: { id: item.supplierId },
                    attributes: [
                        'id',
                        'code',
                        'name',
                        'urlApi',
                        'status',
                    ],
                });

                const mappingCountryData = await mappingCountryModel.findOne({
                    attributes: [
                        'supplierId',
                        'masterId',
                        'code',
                        'name',
                        'status'
                    ],
                    where: {
                        masterId: req.body.country,
                        supplierId: item.supplierId
                    }
                });

                const mappingCityData = await mappingCityModel.findOne({
                    attributes: [
                        'supplierId',
                        'masterId',
                        'countryId',
                        'code',
                        'name',
                        'status'
                    ],
                    where: {
                        masterId: req.body.city,
                        supplierId: item.supplierId
                    }
                });

                const url = item.url.length > 0 ? item.url : supplierData.urlApi;

                // Parse the JSON array in the responseData.body
                const bodyData = JSON.parse(item.body);

                if (bodyData.Login) {
                    // Replace placeholders in the Login object with actual values from the current item
                    bodyData.Login.AgencyCode = item.code;
                    bodyData.Login.Username = item.user;
                    bodyData.Login.Password = item.password;

                    bodyData.CheckOut = req.body.checkOut;
                    bodyData.CheckIn = req.body.checkIn;
                    bodyData.Language = req.body.language;
                    bodyData.Country = mappingCountryData.code;
                    bodyData.City = mappingCityData.code;

                    bodyData.Hotels.Code.splice(0, 1); // Remove the element at the found index
                }

                if (bodyData.Rooms && Array.isArray(bodyData.Rooms.Room)) {
                    const roomArrayIndex = bodyData.Rooms.Room.indexOf("room");

                    if (roomArrayIndex !== -1) {
                        // Check if "room" is found in the array
                        bodyData.Rooms.Room.splice(roomArrayIndex, 1); // Remove the element at the found index
                    }

                    bodyData.Rooms.Room.push(
                        {
                            "RoomNo": req.body.roomNo,
                            "NoOfAdults": req.body.adults,
                            "NoOfChild": "",
                            "Child1Age": "",
                            "Child2Age": "",
                            "ExtraBed": false
                        }
                    );
                }

                if (bodyData.Header) {
                    const hotelIdArrayIndex = bodyData.HotelIDList.indexOf("hotelId");
                    const childAgeArrayIndex = bodyData.RealTimeOccupancy.ChildAgeDetails.indexOf("realTimeAge");

                    if (hotelIdArrayIndex !== -1) {
                        // Check if "hotelId" is found in the array
                        bodyData.HotelIDList.splice(hotelIdArrayIndex, 1); // Remove the element at the found index
                    }

                    if (childAgeArrayIndex !== -1) {
                        // Check if "hotelId" is found in the array
                        bodyData.RealTimeOccupancy.ChildAgeDetails.splice(childAgeArrayIndex, 1); // Remove the element at the found index
                    }

                    // Replace placeholders in bodyData with actual values from responseData
                    bodyData.Header.ClientID = item.user;
                    bodyData.Header.LicenseKey = item.password;
                    bodyData.LowestPriceOnly = req.body.lowestPriceOnly ?? true;
                    bodyData.Destination.CityCode = req.body.cityCode ?? "1704";
                    bodyData.CheckOutDate = req.body.checkOut;
                    bodyData.CheckInDate = req.body.checkIn;
                    bodyData.IsRealTime.Value = req.body.realTimeValue ?? false;
                    bodyData.IsRealTime.RoomCount = req.body.realTimeRoom ?? 1;
                    bodyData.RealTimeOccupancy.ChildCount = req.body.realTimeValue ?? 0;
                    bodyData.RealTimeOccupancy.AdultCount = req.body.realTimeRoom ?? 1;

                }

                bodyData.Nationality = req.body.nationality;
                bodyData.Currency = req.body.currency;

                // Transform bodyData into the data field of the config object
                const configData = {
                    ...bodyData,
                };
                // Add any other modifications you need for each item in the array

                const config = {
                    method: item.method,
                    url: `${url}${item.endpoint}`,
                    data: configData, // Use the body from the current item
                    headers: {
                        'Accept': 'application/json',
                        'Accept-Encoding': 'gzip, deflate, br'
                    }
                };

                axios(config)
                    .then(async function (data) {
                        console.log(data.data)
                        if (data.data.sessionID) {
                            let hotels = data?.data?.hotels?.hotel;

                            // hotels.map(h => {
                            //     h.roomDetails.map((r, ri) => {
                            //         r.id = (ri + 1)
                            //     })
                            // })

                            Promise.all(hotels.map(async hotel => {
                                const hotelData = await mappingHotelModel.findOne({
                                    where: { code: hotel.code },
                                    attributes: [
                                        'id',
                                        'masterId',
                                        'code',
                                        'name',
                                        'status',
                                    ],
                                });

                                if (hotelData) {
                                    const modifiedRoomDetails = hotel.roomDetails.map(({ ...rest }) => rest);
                                    // const modifiedRooms = hotel.roomDetails.map(room => ({
                                    //     roomCode: room.code,
                                    //     ...room.rooms,
                                    // }));
                                    // const modifiedPolicy = hotel.roomDetails.map(room => ({
                                    //     roomCode: room.code,
                                    //     ...room.cancellationPolicies,
                                    // }));
                                    // const modifiedMessage = hotel.roomDetails.map(room => ({
                                    //     roomCode: room.code,
                                    //     ...room.messages,
                                    // }));

                                    // Find the lowest netPrice using reduce
                                    const lowestNetPrice = hotel.roomDetails.reduce((minPrice, room) => {
                                        const netPrice = parseFloat(room.netPrice);
                                        return netPrice < minPrice ? netPrice : minPrice;
                                    }, Infinity);



                                    newHotelObjects.push({
                                        sessionId: data?.data?.sessionID,
                                        supplierId: item.supplierId,
                                        supplierName: supplierData.name,
                                        supplierCode: supplierData.code,
                                        masterId: hotelData.id,
                                        masterCode: hotelData.code,
                                        code: hotel.code,
                                        name: hotel.name,
                                        netPrice: lowestNetPrice,
                                        rating: hotel.rating,
                                        latitude: hotel.latitude,
                                        longitude: hotel.longitude,
                                        roomDetails: modifiedRoomDetails,
                                        // cancellationPolicies: modifiedPolicy,
                                        // rooms: modifiedRooms,
                                        // messages: modifiedMessage,

                                    });
                                }
                            }))
                        }

                        if (data.data.Success) {
                            let hotels = data?.data?.Success?.PriceDetails?.HotelList;
                            await Promise.all(hotels.map(async hotel => {

                                const hotelData = await mappingHotelModel.findOne({
                                    where: { code: hotel.HotelID },
                                    attributes: [
                                        'id',
                                        'masterId',
                                        'code',
                                        'name',
                                        'status',
                                    ],
                                });

                                if (hotelData) {
                                    newHotelObjects.push({
                                        sessionId: data?.data?.sessionID,
                                        supplierId: item.supplierId,
                                        supplierName: supplierData.name,
                                        supplierCode: supplierData.code,
                                        masterId: hotelData.masterId,
                                        masterCode: hotelData.code,
                                        code: hotel.HotelID,
                                        name: hotel.HotelName,
                                        netPrice: hotel.LowestPrice.Value,
                                        rating: 0,
                                        latitude: 0,
                                        longitude: 0,
                                        roomDetails: [],
                                        // cancellationPolicies: [],
                                        // rooms: [],
                                        // messages: [],

                                    });
                                }
                            })
                            )

                            // Create an object to store the cheapest hotels by masterId
                            const cheapestHotelsByMasterId = {};

                            newHotelObjects.forEach((hotel) => {
                                const masterId = hotel.masterId;

                                if (!cheapestHotelsByMasterId[masterId] || hotel.netPrice < cheapestHotelsByMasterId[masterId].netPrice) {
                                    // If no cheapest hotel is found for this masterId or the current hotel has a lower netPrice, update it
                                    cheapestHotelsByMasterId[masterId] = hotel;
                                }
                            });

                            // Convert the object values back to an array
                            const cheapestHotelsArray = Object.values(cheapestHotelsByMasterId);

                            res.status(200).send(responseSuccess('Success', {
                                hotels: cheapestHotelsArray,
                                total: cheapestHotelsArray.length
                            }))
                        }
                    })
                    .catch(error => {
                        // console.log(error)
                        throw error;
                    });

            }));
        }

    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const roomDidaHotels = async (req, res) => {
    try {
        const supplierId = req.params?.supplierId;
        const newRoomObjects = [];

        const data = await supplierApiModel.findOne({
            attributes: ['id', 'supplierId', 'name', 'url', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            where: {
                supplierId: supplierId,
                name: 'Search Room' // Add the condition where name = 'Country'
            },
        });

        // Decrypt the encrypted attributes
        const decryptedData = {
            id: data.id,
            supplierId: data.supplierId,
            name: data.name,
            endpoint: generalConfig.decryptData(data.endpoint),
            method: data.method,
            code: generalConfig.decryptData(data.code),
            user: generalConfig.decryptData(data.user),
            password: generalConfig.decryptData(data.password),
            body: generalConfig.decryptData(data.body),
            status: data.status,
        };

        const supplierData = await supplierModel.findOne({
            where: { id: data.supplierId },
            attributes: [
                'id',
                'code',
                'name',
                'urlApi',
                'status',
            ],
        });

        const responseData = {
            ...decryptedData,
            supplier: supplierData ? supplierData.toJSON() : null,
        };

        // Parse the JSON string in the body
        const bodyData = JSON.parse(responseData.body);

        if (bodyData.Header) {
            const hotelIdArrayIndex = bodyData.HotelIDList.indexOf("hotelId");
            const childAgeArrayIndex = bodyData.RealTimeOccupancy.ChildAgeDetails.indexOf("realTimeAge");

            if (hotelIdArrayIndex !== -1) {
                // Check if "hotelId" is found in the array
                bodyData.HotelIDList.splice(hotelIdArrayIndex, 1); // Remove the element at the found index
            }

            if (childAgeArrayIndex !== -1) {
                // Check if "hotelId" is found in the array
                bodyData.RealTimeOccupancy.ChildAgeDetails.splice(childAgeArrayIndex, 1); // Remove the element at the found index
            }


            // Replace placeholders in bodyData with actual values from responseData
            bodyData.Header.ClientID = responseData.user;
            bodyData.Header.LicenseKey = responseData.password;
            bodyData.HotelIDList.push(req.body.code);
            bodyData.LowestPriceOnly = false;
            bodyData.CheckOutDate = req.body.checkOut;
            bodyData.CheckInDate = req.body.checkIn;
            bodyData.IsRealTime.Value = true;
            bodyData.IsRealTime.RoomCount = req.body.realTimeRoom ?? 1;
            bodyData.RealTimeOccupancy.ChildCount = req.body.realTimeValue ?? 0;
            bodyData.RealTimeOccupancy.AdultCount = req.body.realTimeAdult ?? 1;

        }

        bodyData.Nationality = req.body.nationality ?? "ID";
        bodyData.Currency = req.body.currency ?? "IDR";

        // Transform bodyData into the data field of the config object
        const configData = {
            ...bodyData,
        };

        // Merge the configData with the other properties of the config object
        const config = {
            method: `${responseData.method}`,
            url: `${responseData.supplier.urlApi}${responseData.endpoint}`,
            data: configData,
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        };

        axios(config)
            .then(async function (data) {

                if (data.data.Success) {
                    let rooms = data?.data?.Success?.PriceDetails?.HotelList[0].RatePlanList;
                    await Promise.all(rooms.map(async room => {
                        const policy = [];

                        // policy.push(room?.RatePlanCancellationPolicyList)

                        room.RatePlanCancellationPolicyList.map(async policies => {
                            policy.push({
                                "fromDate": policies.FromDate,
                                "toDate": room?.PriceList[0].StayDate,
                                "amount": policies.Amount,
                                "b2BMarkup": "",
                                "grossAmount": "",
                                "nights": "",
                                "percent": "0",
                                "noShow": false
                            })
                        })

                        console.log(room)
                        newRoomObjects.push({
                            code: room?.RoomTypeID ?? "-",
                            name: room?.RoomName ?? room?.RatePlanName,
                            mealPlan: room?.PriceList[0].MealType,
                            mealPlanName: room?.PriceList[0].MealType,
                            cancellationPolicyType: room?.RoomTypeID,
                            promoCode: "-",
                            promoName: "-",
                            availFlag: false,
                            canAmend: false,
                            canHold: false,
                            netPrice: room.TotalPrice,
                            grossPrice: room.TotalPrice,
                            avgNightPrice: room.TotalPrice,
                            b2BMarkup: 0,
                            packageRate: false,
                            cancellationPolicies: {
                                policy: policy
                            },
                            rooms: {
                                room: [
                                    {
                                        "roomNo": room.RoomOccupancy.RoomNum,
                                        "rateKey": room.RatePlanID,
                                        "noOfAdults": room.RoomOccupancy.AdultCount,
                                        "noOfChild": room.RoomOccupancy.ChildCount,
                                        "child1Age": 0,
                                        "child2Age": 0,
                                        "extraBed": false,
                                        "netPrice": room.TotalPrice,
                                        "grossPrice": room.TotalPrice,
                                        "avgNightPrice": room.TotalPrice,
                                        "b2BMarkup": 0,
                                        "rateDetails": {
                                            "nightlyRates": {
                                                "nightlyRate": [
                                                    {
                                                        "srNo": 1,
                                                        "netPrice": 500001.01,
                                                        "grossPrice": 500001.01,
                                                        "b2BMarkup": 0,
                                                        "supplementaryDetails": {
                                                            "supplement": [
                                                                {
                                                                    "code": "SUPPATBOOK",
                                                                    "name": "SUPP",
                                                                    "amount": 300000,
                                                                    "description": ""
                                                                }
                                                            ]
                                                        },
                                                        "compulsoryDetails": {
                                                            "compulsory": []
                                                        }
                                                    }
                                                ]
                                            },
                                            "discountDetails": null
                                        }
                                    }
                                ]
                            },
                            messages: {
                                message: [
                                    {
                                        "content": "-",
                                        "cDataContent": [
                                            {
                                                "#cdata-section": "-"
                                            }
                                        ]
                                    }
                                ]
                            },

                        });
                    })
                    )

                    res.status(200).send(responseSuccess('Success', {
                        rooms: newRoomObjects,
                        total: newRoomObjects.length
                    }))
                }
            })
            .catch(error => {
                // console.log(error)
                throw error;
            });


    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const recheckHotels = async (req, res) => {
    try {

        let recheckObjects = {};

        const data = await supplierApiModel.findOne({
            attributes: ['id', 'supplierId', 'name', 'url', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            where: {
                supplierId: req.body.supplierId,
                name: 'Confirm'
            },
        });

        if (!data || data.length === 0) {
            return res.status(404).send(responseError('Data not found.'));
        }

        // Decrypt the encrypted attributes
        const decryptedData = {
            id: data.id,
            supplierId: data.supplierId,
            name: data.name,
            endpoint: generalConfig.decryptData(data.endpoint),
            method: data.method,
            code: generalConfig.decryptData(data.code),
            user: generalConfig.decryptData(data.user),
            password: generalConfig.decryptData(data.password),
            body: generalConfig.decryptData(data.body),
            status: data.status,
        };

        const supplierData = await supplierModel.findOne({
            where: { id: req.body.supplierId },
            attributes: [
                'id',
                'code',
                'name',
                'urlApi',
                'status',
            ],
        });

        const responseData = {
            ...decryptedData,
            supplier: supplierData ? supplierData.toJSON() : null,
        };


        const mappingCountryData = await mappingCountryModel.findOne({
            attributes: [
                'supplierId',
                'masterId',
                'code',
                'name',
                'status'
            ],
            where: {
                masterId: req.body.country,
                supplierId: req.body.supplierId
            }
        });

        const mappingCityData = await mappingCityModel.findOne({
            attributes: [
                'supplierId',
                'masterId',
                'countryId',
                'code',
                'name',
                'status'
            ],
            where: {
                masterId: req.body.city,
                supplierId: req.body.supplierId
            }
        });


        // Parse the JSON string in the body
        const bodyData = JSON.parse(responseData.body);

        if (bodyData.Login) {
            // Replace placeholders in the Login object with actual values from the current item
            bodyData.Login.AgencyCode = responseData.code;
            bodyData.Login.Username = responseData.user;
            bodyData.Login.Password = responseData.password;

            bodyData.CheckOut = req.body.checkOut;
            bodyData.CheckIn = req.body.checkIn;
            bodyData.Language = req.body.language ?? "EN";
            bodyData.Country = mappingCountryData.code;
            bodyData.City = mappingCityData.code;

            bodyData.SessionID = req.body.sessionId;
            bodyData.HotelCode = req.body.hotelCode;
            bodyData.RoomDetails.Code = req.body.roomCode;
            bodyData.RoomDetails.MealPlan = req.body.mealPlan;
            bodyData.RoomDetails.CancellationPolicyType = req.body.cancelPolicyType;
            bodyData.RoomDetails.PackageRate = req.body.packageRate ?? false;

            if (bodyData.Rooms && Array.isArray(bodyData.Rooms.Room)) {
                const roomArrayIndex = bodyData.Rooms.Room.indexOf("room");

                if (roomArrayIndex !== -1) {
                    // Check if "room" is found in the array
                    bodyData.Rooms.Room.splice(roomArrayIndex, 1); // Remove the element at the found index
                }

                bodyData.Rooms.Room.push(
                    {
                        "RoomNo": req.body.roomNo,
                        "NoOfAdults": req.body.adults,
                        "NoOfChild": "",
                        "Child1Age": "",
                        "Child2Age": "",
                        "ExtraBed": false,
                        "RateKey": req.body.rateKey
                    }
                );
            }
        }

        if (bodyData.Header) {

            // Replace placeholders in bodyData with actual values from responseData
            bodyData.Header.ClientID = responseData.user;
            bodyData.Header.LicenseKey = responseData.password;
            bodyData.CheckOutDate = req.body.checkOut;
            bodyData.CheckInDate = req.body.checkIn;
            bodyData.NumOfRooms = req.body.roomNo;
            bodyData.HotelID = req.body.hotelCode;

            bodyData.OccupancyDetails[0].ChildCount = req.body.childs ?? 0;
            bodyData.OccupancyDetails[0].AdultCount = 1;
            bodyData.OccupancyDetails[0].RoomNum = req.body.roomNo;
            bodyData.OccupancyDetails[0].ChildAgeDetails = [];

            bodyData.RatePlanID = req.body.rateKey;
        }

        bodyData.Nationality = req.body.nationality ?? "ID";
        bodyData.Currency = req.body.currency ?? "IDR";

        // Transform bodyData into the data field of the config object
        const configData = {
            ...bodyData,
        };

        // Merge the configData with the other properties of the config object
        const config = {
            method: `${responseData.method}`,
            url: `${responseData.supplier.urlApi}${responseData.endpoint}`,
            data: configData,
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        };


        // const config = {
        //     method: 'post',
        //     url: `${process.env.JARVIS_URL}Hotel/RecheckHotel`,
        //     data: {
        //         "Login": {
        //             "AgencyCode": process.env.JARVIS_AGENCY_CODE,
        //             "Username": process.env.JARVIS_USER,
        //             "Password": process.env.JARVIS_PASS,
        //         },
        //         "SessionID": req.body.sessionId,
        //         "Nationality": req.body.nationality,
        //         "Country": mappingCountryData.code,
        //         "City": mappingCityData.code,
        //         "CheckIn": req.body.checkIn,
        //         "CheckOut": req.body.checkOut,
        //         "HotelCode": req.body.hotelCode,
        //         "RoomDetails": {
        //             "Code": req.body.roomCode,
        //             "MealPlan": req.body.mealPlan,
        //             "CancellationPolicyType": req.body.cancelPolicyType,
        //             "PackageRate": false
        //         },
        //         "Rooms": {
        //             "Room": [
        //                 {
        //                     "RoomNo": req.body.roomNo,
        //                     "NoOfAdults": 2,
        //                     "NoOfChild": req.body.children,
        //                     "Child1Age": req.body.child1Age,
        //                     "Child2Age": req.body.child2Age,
        //                     "ExtraBed": false,
        //                     "RateKey": req.body.rateKey
        //                 }
        //             ]
        //         },
        //         "Currency": "IDR",
        //         "Language": "EN",
        //         "AvailFlag": true,
        //         "DetailLevel": "FULL"
        //     },
        //     headers: {
        //         'Accept': 'application/json'
        //     }
        // };

        console.log(config)

        axios(config)
            .then(async function (data) {

                if (data.data.status) {
                    res.status(200).send(responseSuccess('successfully recheck', data?.data?.hotels?.hotel))
                } else if (data.data.Success) {
                    console.log(data.data.Success.PriceDetails)
                    let hotelData = data?.data?.Success?.PriceDetails?.HotelList[0];
                    let rooms = hotelData.RatePlanList;
                    
                    await Promise.all(rooms.map(async room => {
                        const policy = [];

                        // policy.push(room?.RatePlanCancellationPolicyList)

                        room?.CancellationPolicyList?.map(async policies => {
                            policy.push({
                                "fromDate": policies.FromDate,
                                "toDate": room?.PriceList[0].StayDate,
                                "amount": policies.Amount,
                                "b2BMarkup": "",
                                "grossAmount": "",
                                "nights": "",
                                "percent": "0",
                                "noShow": false
                            })
                        })

                        recheckObjects = {
                            code:hotelData.HotelID,
                            name:req.body.hotelName,
                            latitude:0,
                            longitude:0,
                            rating:0,
                            referenceNo:data?.data?.Success?.PriceDetails?.ReferenceNo,
                            roomDetails: {
                                code: room?.RoomTypeID ?? "-",
                                name: room?.RoomName ?? room?.RatePlanName,
                                mealPlan: room?.PriceList[0].MealType,
                                mealPlanName: room?.PriceList[0].MealType,
                                cancellationPolicyType: room?.RoomTypeID,
                                promoCode: "-",
                                promoName: "-",
                                availFlag: false,
                                canAmend: false,
                                canHold: false,
                                netPrice: room.TotalPrice,
                                grossPrice: room.TotalPrice,
                                avgNightPrice: room.TotalPrice,
                                b2BMarkup: 0,
                                packageRate: false,
                                cancellationPolicies: {
                                    policy: policy
                                },
                            },
                            rooms: {
                                room: [
                                    {
                                        "roomNo": room.RoomOccupancy.RoomNum,
                                        "rateKey": room.RatePlanID,
                                        "noOfAdults": room.RoomOccupancy.AdultCount,
                                        "noOfChild": room.RoomOccupancy.ChildCount,
                                        "child1Age": 0,
                                        "child2Age": 0,
                                        "extraBed": false,
                                        "netPrice": room.TotalPrice,
                                        "grossPrice": room.TotalPrice,
                                        "avgNightPrice": room.TotalPrice,
                                        "b2BMarkup": 0,
                                        "rateDetails": {
                                            "nightlyRates": {
                                                "nightlyRate": [
                                                    {
                                                        "srNo": 1,
                                                        "netPrice": 500001.01,
                                                        "grossPrice": 500001.01,
                                                        "b2BMarkup": 0,
                                                        "supplementaryDetails": {
                                                            "supplement": [
                                                                {
                                                                    "code": "SUPPATBOOK",
                                                                    "name": "SUPP",
                                                                    "amount": 300000,
                                                                    "description": ""
                                                                }
                                                            ]
                                                        },
                                                        "compulsoryDetails": {
                                                            "compulsory": []
                                                        }
                                                    }
                                                ]
                                            },
                                            "discountDetails": null
                                        }
                                    }
                                ]
                            },
                            messages: {
                                message: [
                                    {
                                        "content": "-",
                                        "cDataContent": [
                                            {
                                                "#cdata-section": "-"
                                            }
                                        ]
                                    }
                                ]
                            },

                        };
                    })
                    )

                    res.status(200).send(responseSuccess('successfully recheck', recheckObjects))
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
    roomDidaHotels,
    bookingList,
    bookingDetail,
    bookingCancel,
}