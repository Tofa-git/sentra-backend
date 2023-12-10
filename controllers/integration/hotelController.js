
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
const { read } = require('fs');

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
                            "NoOfAdults": req.body.adult,
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
        let hotelPromises;
        const newRoomObjects = [];
        let readProcess = 0;
        let readTotal = 0;
        const data = await supplierApiModel.findAll({
            attributes: ['id', 'supplierId', 'name', 'url', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            where: {
                // supplierId: supplierId,
                [Op.or]: [
                    { name: 'Search Room' },
                    { name: 'Search' }
                ]
            },
        });

        if (!data || data.length === 0) {
            return res.status(404).send(responseError('Data not found.'));
        }

        // Decrypt the encrypted attributes for each data entry
        const decryptedData = data
            .map((entry) => {
                if (entry.supplierId !== 5 || entry.name !== 'Search') {
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
                }
                return null; // return null for entries that don't meet the conditions
            })
            .filter((entry) => entry !== null); // filter out null entries

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

                const hotelData = await mappingHotelModel.findOne({
                    where: { code: req.body.code },
                    attributes: [
                        'id',
                        'masterId',
                        'code',
                        'name',
                        'status',
                    ],
                });

                if (hotelData) {

                    const updatedHotelData = await mappingHotelModel.findAll({
                        where: {
                            masterId: hotelData.masterId,
                            supplierId: item.supplierId,
                        },
                        attributes: ['id', 'masterId', 'supplierId', 'countryId', 'cityId', 'code', 'name', 'status'],
                    });

                    const url = item.url.length > 0 ? item.url : supplierData.urlApi;

                    // Parse the JSON array in the responseData.body
                    const bodyData = JSON.parse(item.body);
                    const timeoutMs = 100000; // Set your desired timeout in milliseconds

                    hotelPromises = await Promise.all(updatedHotelData.map(async (updatedHotelData) => {

                        console.log('Start processing hotel:', updatedHotelData.code);

                        const mappingCountryData = await mappingCountryModel.findOne({
                            attributes: [
                                'id',
                                'supplierId',
                                'masterId',
                                'code',
                                'name',
                                'status'
                            ],
                            where: {
                                id: updatedHotelData.countryId
                            }
                        });

                        const mappingCityData = await mappingCityModel.findOne({
                            attributes: [
                                'id',
                                'supplierId',
                                'masterId',
                                'countryId',
                                'code',
                                'name',
                                'status'
                            ],
                            where: {
                                id: updatedHotelData.cityId
                            }
                        });

                        if (bodyData.Login) {
                            // Replace placeholders in the Login object with actual values from the current item

                            const hotelIdArrayIndex = bodyData.Hotels.Code.indexOf("code");

                            bodyData.Login.AgencyCode = item.code;
                            bodyData.Login.Username = item.user;
                            bodyData.Login.Password = item.password;

                            bodyData.CheckOut = req.body.checkOut;
                            bodyData.CheckIn = req.body.checkIn;
                            bodyData.Language = req.body.language;
                            bodyData.Country = mappingCountryData.code;
                            bodyData.City = mappingCityData.code;

                            if (hotelIdArrayIndex !== -1) {
                                // Check if "hotelId" is found in the array
                                bodyData.Hotels.Code.splice(0, 1); // Remove the element at the found index
                            }

                            bodyData.Hotels.Code.push(updatedHotelData.code);

                            if (bodyData.Rooms && Array.isArray(bodyData.Rooms.Room)) {
                                const roomArrayIndex = bodyData.Rooms.Room.indexOf("room");

                                if (roomArrayIndex !== -1) {
                                    // Check if "room" is found in the array
                                    bodyData.Rooms.Room.splice(roomArrayIndex, 1); // Remove the element at the found index
                                }

                                bodyData.Rooms.Room.push(
                                    {
                                        "RoomNo": req.body.realTimeRoom,
                                        "NoOfAdults": req.body.realTimeAdult,
                                        "NoOfChild": "",
                                        "Child1Age": "",
                                        "Child2Age": "",
                                        "ExtraBed": false
                                    }
                                );
                            }
                            readTotal += 1;
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
                            bodyData.HotelIDList.push(parseInt(updatedHotelData.code));
                            bodyData.LowestPriceOnly = false;
                            bodyData.CheckOutDate = req.body.checkOut;
                            bodyData.CheckInDate = req.body.checkIn;
                            bodyData.IsRealTime.Value = true;
                            bodyData.IsRealTime.RoomCount = req.body.realTimeRoom ?? 1;
                            bodyData.RealTimeOccupancy.ChildCount = req.body.realTimeValue ?? 0;
                            bodyData.RealTimeOccupancy.AdultCount = req.body.realTimeAdult ?? 1;

                            readTotal += 1;
                        }

                        bodyData.Nationality = req.body.nationality ?? "ID";
                        bodyData.Currency = req.body.currency ?? "IDR";

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

                        try {
                            const axiosPromise =
                                axios(config)
                                    .then(async function (data) {
                                        // console.log(data)
                                        if (data.data.sessionID) {
                                            console.log(data.data)
                                            let hotels = data?.data?.hotels?.hotel[0].roomDetails;

                                            await Promise.all(hotels.map(async hotel => {
                                                newRoomObjects.push({
                                                    supplierId: item.supplierId,
                                                    supplierCode: supplierData.code,
                                                    supplierName: supplierData.name,
                                                    sessionId: data.data.sessionID,
                                                    hotelCode: updatedHotelData.code,
                                                    hotelName: updatedHotelData.name,
                                                    code: hotel?.code,
                                                    name: hotel?.name,
                                                    mealPlan: hotel?.mealPlan,
                                                    mealPlanName: hotel?.mealPlanName,
                                                    cancellationPolicyType: hotel?.cancellationPolicyType,
                                                    promoCode: hotel?.promoCode,
                                                    promoName: hotel?.promoName,
                                                    availFlag: hotel?.availFlag,
                                                    canAmend: hotel?.canAmend,
                                                    canHold: hotel?.canHold,
                                                    netPrice: hotel?.netPrice,
                                                    grossPrice: hotel?.grossPrice,
                                                    avgNightPrice: hotel?.avgNightPrice,
                                                    b2BMarkup: hotel?.b2BMarkup,
                                                    packageRate: hotel?.packageRate,
                                                    cancellationPolicies: hotel?.cancellationPolicies,
                                                    rooms: hotel?.rooms,
                                                    messages: hotel?.messages

                                                });
                                            }))
                                            readProcess += 1;
                                        }

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


                                                newRoomObjects.push({
                                                    supplierId: item.supplierId,
                                                    supplierCode: supplierData.code,
                                                    supplierName: supplierData.name,
                                                    sessionId: req.body.sessionId,
                                                    hotelCode: updatedHotelData.code,
                                                    hotelName: updatedHotelData.name,
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
                                                                                "netPrice": room.TotalPrice,
                                                                                "grossPrice": room.TotalPrice,
                                                                                "b2BMarkup": 0,
                                                                                "supplementaryDetails": {
                                                                                    "supplement": [
                                                                                        {
                                                                                            "code": "SUPPATBOOK",
                                                                                            "name": "SUPP",
                                                                                            "amount": room.TotalPrice,
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
                                            readProcess += 1;
                                        }
                                        console.log("Test")
                                        console.log(readProcess)
                                        console.log(decryptedData.length)

                                    })

                            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Promise timeout')), timeoutMs));

                            await Promise.race([axiosPromise, timeoutPromise]);

                            console.log('Promise completed successfully for hotel:', updatedHotelData.code);
                        } catch (error) {
                            res.status(500).send(responseError('Error occurred'));
                            throw error;
                        }



                    }))                    
                }
            }))
            try {
                console.log('Before await Promise.all');
                await Promise.all(hotelPromises);
                console.log('After await Promise.all');

                // If this code is reached, it means all promises are resolved
                console.log('All promises are resolved');

                // 'results' will contain an array of resolved values from each promise

                // Send the response once after all promises are resolved
                res.status(200).send(responseSuccess('Success', {
                    rooms: newRoomObjects,
                    total: newRoomObjects.length
                }));
            } catch (error) {
                // Handle any errors that occurred in the promises
                console.error(error);
                // res.status(500).send(responseError('Error occurred'));
            }

        }

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
                        "NoOfAdults": req.body.adult,
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
            bodyData.HotelID = parseInt(req.body.hotelCode);

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


        axios(config)
            .then(async function (data) {
                
                if (data.data.status) {                    
                    recheckObjects = {
                        code: data.data.hotels.hotel.code,
                        name: data.data.hotels.hotel.name,
                        latitude: data.data.hotels.hotel.latitude,
                        longitude: data.data.hotels.hotel.longitude,
                        rating: data.data.hotels.hotel.rating,
                        sessionId: data.data.sessionID,
                        roomDetails: data.data.hotels.hotel.roomDetails,
                        rooms: data.data.hotels.hotel.roomDetails.rooms,
                        messages: data.data.hotels.hotel.roomDetails.messages

                    };
                    
                    res.status(200).send(responseSuccess('successfully recheck', recheckObjects))
                } else if (data.data.Success) {

                    let hotelData = data?.data?.Success?.PriceDetails?.HotelList[0];
                    let rooms = hotelData.RatePlanList;

                    await Promise.all(rooms.map(async room => {
                        const policy = [];

                        // policy.push(room?.RatePlanCancellationPolicyList)

                        hotelData?.CancellationPolicyList?.map(async policies => {
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
                            code: hotelData.HotelID,
                            name: req.body.hotelName,
                            latitude: 0,
                            longitude: 0,
                            rating: 0,
                            sessionId: data?.data?.Success?.PriceDetails?.ReferenceNo,
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
                                                        "netPrice": room.TotalPrice,
                                                        "grossPrice": room.TotalPrice,
                                                        "b2BMarkup": 0,
                                                        "supplementaryDetails": {
                                                            "supplement": [
                                                                {
                                                                    "code": "SUPPATBOOK",
                                                                    "name": "SUPP",
                                                                    "amount": room.TotalPrice,
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
                res.status(500).send(responseError('Error occurred'));
            });

    } catch (error) {
        if (data.data.Error) {
            res.status(500).send(responseError(data.data.Error.Message))
        }
        res.status(500).send(responseError(error))
    }
}

const bookingHotels = async (req, res) => {
    try {
        let bookingObjects = {};

        const data = await supplierApiModel.findOne({
            attributes: ['id', 'supplierId', 'name', 'url', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            where: {
                supplierId: req.body.supplierId,
                name: 'Book'
            },
        });

        if (!data || data.length === 0) {
            return res.status(404).send(responseError('You need to make an book API.'));
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

        // Parse the JSON string in the body
        const bodyData = JSON.parse(responseData.body);

        if (bodyData.Login) {
            // Replace placeholders in the Login object with actual values from the current item
            bodyData.Login.AgencyCode = responseData.code;
            bodyData.Login.Username = responseData.user;
            bodyData.Login.Password = responseData.password;

            bodyData.CheckOut = req.body.checkOut;
            bodyData.CheckIn = req.body.checkIn;
            bodyData.Language = req.body.language ?? "ID";

            bodyData.SessionID = req.body.sessionId;
            bodyData.HotelCode = req.body.hotelCode;
            bodyData.RoomDetails.Code = req.body.roomCode;
            bodyData.RoomDetails.MealPlan = req.body.mealPlan;
            bodyData.RoomDetails.CancellationPolicyType = req.body.cancelPolicyType;
            bodyData.RoomDetails.PackageRate = req.body.packageRate ?? false;

            bodyData.AgencyBookingID = "SE" + crypto.randomInt(10000, 99999).toString();
            bodyData.SpecialReq = req.body.request ?? "";

            bodyData.Nationality = req.body.nationality ?? "ID";
            bodyData.Currency = req.body.currency ?? "IDR";

            if (bodyData.Rooms && Array.isArray(bodyData.Rooms.Room)) {
                const roomArrayIndex = bodyData.Rooms.Room.indexOf("room");

                if (roomArrayIndex !== -1) {
                    // Check if "room" is found in the array
                    bodyData.Rooms.Room.splice(roomArrayIndex, 1); // Remove the element at the found index
                }

                // Parse req.body.adult to an integer
                const adultCount = parseInt(req.body.adult);

                // Create an array of "Pax" objects
                const paxArray = [];
                for (let i = 0; i < adultCount; i++) {
                    paxArray.push({
                        "Salutation": req.body.guests[i].salutation,
                        "FirstName": req.body.guests[i].firstName,
                        "LastName": req.body.guests[i].lastName,
                        "Age": req.body.guests[i].age
                    });
                }

                bodyData.Rooms.Room.push(
                    {
                        "PaxDetails": {
                            "Pax": paxArray
                        },
                        "RoomNo": req.body.roomNo.toString(),
                        "NoOfAdults": req.body.adult.toString(),
                        "NoOfChild": req.body.children.toString(),
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
            bodyData.ReferenceNo = req.body.sessionId;
            bodyData.GuestList[0].RoomNum = req.body.roomNo;

            bodyData.Contact.Name.First = req.body.contact.nameFirst;
            bodyData.Contact.Name.Last = req.body.contact.nameLast;
            bodyData.Contact.Email = req.body.contact.email;
            bodyData.Contact.Phone = req.body.contact.phone;



            // Parse req.body.adult to an integer
            const adultCount = parseInt(req.body.adult);

            // Create an array of "Pax" objects
            const paxArray = [];
            for (let i = 0; i < adultCount; i++) {
                paxArray.push({
                    "IsAdult": req.body.guests[i].age < 17 ? false : true,
                    "Name": {
                        "Last": req.body.guests[i].lastName,
                        "First": req.body.guests[i].firstName
                    }
                });
            }

            bodyData.GuestList[0].GuestInfo = paxArray;

            bodyData.ClientReference = req.body.rateKey;
        }

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
                console.log(data)
                if (data.data.status) {
                    bookingModel.create({
                        bookingId: data?.data?.bookingDetails.mgBookingID,
                        supplierId: req.body.supplierId,
                        bookingStatus: "CONF",
                        agencyBookingId: data?.data?.bookingDetails.agencyBookingID,
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
                        additionalRequest: JSON.stringify(req.body.request),
                    });

                    let guests = [];
                    req.body.guests.map(v => {
                        guests.push({
                            ...v,
                            bookingId: data?.data?.bookingDetails.mgBookingID,
                            createdBy: req.user.id,
                        });
                    })
                    bookingGuestModel.bulkCreate(guests);

                    res.status(200).send(responseSuccess('successfully book', data?.data?.bookingDetails))
                } else if (data.data.Success) {
                    let booking = data.data?.Success?.BookingDetails
                    await bookingModel.create({
                        bookingId: booking.BookingID,
                        agencyBookingId: booking.ClientReference,
                        localBookingId: "SE" + crypto.randomInt(10000, 99999).toString(),
                        supplierId: req.body.supplierId,
                        bookingStatus: "CONF",
                        mgBookingVersionID: "-",
                        agencyVoucherNo: "-",
                        agencyVoucherDate: "-",
                        hotelCode: booking.Hotel.HotelID,
                        hotelName: booking.Hotel.HotelName,
                        roomCode: req.body.roomCode,
                        roomName: booking.Hotel.RatePlanList[0].RatePlanName,
                        checkIn: req.body.checkIn,
                        checkOut: req.body.checkOut,
                        mealPlan: req.body.mealPlan,
                        cancellationPolicyType: "-",
                        cancellationPolicyAmount: booking.Hotel.CancellationPolicyList[0].Amount,
                        cancellationPolicyDate: booking.Hotel.CancellationPolicyList[0].FromDate,
                        netPrice: parseInt(booking.TotalPrice),
                        grossPrice: parseInt(booking.TotalPrice),
                        createdBy: req.user.id,
                        status: 1,
                        roomDetail: JSON.stringify(req.body.roomDetail),
                        additionalRequest: JSON.stringify(req.body.request),
                    });

                    let guests = [];
                    req.body.guests.map(v => {
                        guests.push({
                            ...v,
                            bookingId: booking.BookingID,
                            createdBy: req.user.id,
                        });
                    })
                    await bookingGuestModel.bulkCreate(guests);

                    res.status(200).send(responseSuccess('successfully book', data.data?.Success?.BookingDetails))
                }


            })
            .catch(function (error) {
                res.status(500).send(responseError(error))

            });

    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const bookingList = async (req, res) => {
    try {
        const data = await bookingModel.findAndCountAll({
            attributes: [
                'id',
                'supplierId',
                'bookingId',
                'agencyBookingId',
                'mgBookingVersionID',
                'agencyVoucherNo',
                'agencyVoucherDate',
                'bookingStatus',
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
                bookingId: {
                    [Op.like]: ['%' + (req.query.bookingId ?? '') + '%'],
                },
                status: 1,
            }
        });

        // Retrieve the suppman data for each entry
        const responseData = await Promise.all(
            data.rows.map(async (entry) => {
                const supplierData = await supplierModel.findOne({
                    where: { id: entry.supplierId },
                    attributes: [
                        'id',
                        'code',
                        'name',
                        'urlApi',
                        'status',
                    ],
                });

                return {
                    ...entry.toJSON(),
                    supplier: supplierData,
                };
            })
        );

        const result = paginattionGenerator(req, {
            count: data.count,
            rows: responseData,
        });
        res.status(200).send(responseSuccess('Data found.', result));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const bookingDetail = async (req, res) => {
    try {
        const newDetailObjects = [];

        const data = await supplierApiModel.findOne({
            attributes: ['id', 'supplierId', 'name', 'url', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            where: {
                supplierId: req.body.supplierId,
                name: 'bookingList'
            },
        });


        if (!data || data.length === 0) {
            return res.status(404).send(responseError('You need to make an book API.'));
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
        
        // Parse the JSON string in the body
        const bodyData = JSON.parse(responseData.body);

        if (bodyData.Login) {
            // Replace placeholders in the Login object with actual values from the current item
            bodyData.Login.AgencyCode = responseData.code;
            bodyData.Login.Username = responseData.user;
            bodyData.Login.Password = responseData.password;

            bodyData.MGBookingID = req.params.id;
            bodyData.AgencyBookingID = req.body.agencyBookingId ?? "";
            bodyData.Language = req.body.language ?? "EN";


        }

        if (bodyData.Header) {

            // Replace placeholders in bodyData with actual values from responseData
            bodyData.Header.ClientID = responseData.user;
            bodyData.Header.LicenseKey = responseData.password;

            bodyData.SearchBy.BookingID = req.params.id
        }

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
                console.log(config)
                if (data.data.status) {
                    const [local] = await db.sequelize.query(`
                        SELECT
                            b.id bookingId,
                            b.agencyBookingId localBookingId,
                            b.bookingId bookingMgBookingID,
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
                        
                        WHERE b.bookingId = '${req.params.id}'
                            AND b.status = '1'
                    `);

                    const guests = await bookingGuestModel.findAll({ where: { bookingId: req.params.id } })

                    res.status(200).send(responseSuccess('successfully retrieving', {
                        ...data?.data?.bookingDetails,
                        local: {
                            ...local[0],
                            bookingRoomDetail: JSON.parse(local[0].bookingRoomDetail),
                            bookingAdditionalRequest: JSON.parse(local[0].bookingAdditionalRequest),
                            guests,
                        },
                    }))


                } else if (data.data.Success) {
                    let details = data?.data?.Success?.BookingDetailsList[0];
                    const policy = [];
                    const bookingData = await bookingModel.findOne({
                        where: { bookingId: req.params.id, status: 1 },
                        attributes: [
                            'id',
                            'supplierId',
                            'localBookingId',
                            'bookingId',
                            'agencyBookingId',
                            'mgBookingVersionID',
                            'bookingStatus',
                            'agencyVoucherNo',
                            'agencyVoucherDate',
                            'hotelCode',
                            'hotelName',
                            'roomCode',
                            'roomName',
                            'checkIn',
                            'checkOut',
                            'netPrice',
                            'additionalRequest',
                        ],
                    });

                    details.Hotel.CancellationPolicyList.map(async policies => {
                        policy.push({
                            "fromDate": policies.FromDate,
                            "toDate": details.Hotel.RatePlanList[0]?.PriceList[0].StayDate,
                            "amount": policies.Amount,
                            "b2BMarkup": "",
                            "grossAmount": "",
                            "nights": "",
                            "percent": "0",
                            "noShow": false
                        })
                    })

                    newDetailObjects.push({
                        mgBookingID: bookingData.bookingId ?? "-",
                        agencyBookingID: bookingData.agencyBookingId,
                        mgBookingVersionID: bookingData.mgBookingVersionID,
                        hotelBookingID: details.Hotel.HotelID,
                        agencyVoucherNo: bookingData.agencyVoucherNo,
                        agencyVoucherDate: bookingData.agencyVoucherDate,
                        status: bookingData.bookingStatus,
                        specialRequest: {
                            "content": bookingData.additionalRequest,
                            "cDataContent": [
                                {
                                    "#cdata-section": bookingData.additionalRequest
                                }
                            ]
                        },
                        bookingDt: details.OrderDate,
                        nationality: "ID",
                        checkIn: details.CheckInDate,
                        checkOut: details.CheckOutDate,
                        currency: "IDR",
                        hotels: {
                            hotel: {
                                "code": details.Hotel.HotelID,
                                "name": details.Hotel.HotelName,
                                "rating": "-",
                                "latitude": "-",
                                "longitude": "",
                                "roomDetails": {
                                    "code": details.Hotel.RatePlanList[0].RoomTypeID,
                                    "name": details.Hotel.RatePlanList[0].RoomName,
                                    "mealPlan": "BDBF",
                                    "mealPlanName": "Breakfast",
                                    "cancellationPolicyType": "Flexi",
                                    "promoCode": "",
                                    "promoName": "",
                                    "availFlag": true,
                                    "canAmend": false,
                                    "isOnHold": false,
                                    "netPrice": 400001.01,
                                    "grossPrice": 400001.01,
                                    "msp": "",
                                    "avgNightPrice": 400001.01,
                                    "b2BMarkup": 0.00,
                                    "cancellationPolicies": {
                                        "policy": [
                                            {
                                                "fromDate": "2024-01-24",
                                                "toDate": "2024-01-25",
                                                "amount": "",
                                                "b2BMarkup": "",
                                                "grossAmount": "",
                                                "nights": "",
                                                "percent": "100.00",
                                                "noShow": false
                                            },
                                            {
                                                "fromDate": "2024-01-26",
                                                "toDate": "2024-01-26",
                                                "amount": "",
                                                "b2BMarkup": "",
                                                "grossAmount": "",
                                                "nights": "1",
                                                "percent": "",
                                                "noShow": true
                                            }
                                        ]
                                    },
                                    "appliedCancellationPolicies": {
                                        "policy": {
                                            "fromDate": "2023-09-21",
                                            "toDate": "2024-01-23",
                                            "amount": "0.00",
                                            "b2BMarkup": "0.00",
                                            "grossAmount": "0.00",
                                            "nights": "",
                                            "percent": "",
                                            "noShow": false
                                        },
                                        "cancellationCharges": {
                                            "amount": "0.00",
                                            "b2BMarkup": "0.00",
                                            "grossAmount": "0.00",
                                            "currency": "IDR"
                                        }
                                    },
                                    "rooms": {
                                        "room": [
                                            {
                                                "roomNo": 1,
                                                "rateKey": null,
                                                "status": "CANCELCONF",
                                                "noOfAdults": 1,
                                                "noOfChild": 0,
                                                "extraBed": false,
                                                "netPrice": 400001.01,
                                                "grossPrice": 400001.01,
                                                "avgNightPrice": 400001.01,
                                                "b2BMarkup": 0.00,
                                                "paxDetails": {
                                                    "pax": [
                                                        {
                                                            "salutation": "NONE",
                                                            "firstName": "Agung",
                                                            "lastName": "Wicaksono",
                                                            "age": ""
                                                        }
                                                    ]
                                                },
                                                "rateDetails": {
                                                    "nightlyRates": {
                                                        "nightlyRate": [
                                                            {
                                                                "srNo": 1,
                                                                "netPrice": 400001.01,
                                                                "grossPrice": 400001.01,
                                                                "b2BMarkup": 0.00,
                                                                "supplementaryDetails": {
                                                                    "supplement": []
                                                                },
                                                                "compulsoryDetails": {
                                                                    "compulsory": []
                                                                }
                                                            }
                                                        ]
                                                    },
                                                    "discountDetails": {
                                                        "total": 0.00,
                                                        "promo": []
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    "messages": {
                                        "message": []
                                    },
                                    "packageRate": false
                                }
                            }
                        },
                        cancellationPolicies: {
                            policy: policy
                        },
                        rooms: {
                            room: [
                                {
                                    "roomNo": details.Hotel.RatePlanList[0].RoomNum,
                                    "rateKey": details.Hotel.RatePlanList[0].RatePlanID,
                                    "noOfAdults": details.Hotel.RatePlanList[0].AdultCount,
                                    "noOfChild": details.Hotel.RatePlanList[0].ChildCount,
                                    "child1Age": 0,
                                    "child2Age": 0,
                                    "extraBed": false,
                                    "netPrice": details.TotalPrice,
                                    "grossPrice": details.TotalPrice,
                                    "avgNightPrice": details.TotalPrice,
                                    "b2BMarkup": 0,
                                    "rateDetails": {
                                        "nightlyRates": {
                                            "nightlyRate": [
                                                {
                                                    "srNo": 1,
                                                    "netPrice": details.TotalPrice,
                                                    "grossPrice": details.TotalPrice,
                                                    "b2BMarkup": 0,
                                                    "supplementaryDetails": {
                                                        "supplement": [
                                                            {
                                                                "code": "",
                                                                "name": "",
                                                                "amount": details.TotalPrice,
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
                        packageRate: false
                    });
                    const [local] = await db.sequelize.query(`
                    SELECT
                        b.id bookingId,
                        b.localBookingId localBookingId,
                        b.bookingId bookingMgBookingID,
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
                        u.id userId,
                        u.firstName userFirstName,
                        u.lastName userLastName,
                        u.email userEmail,
                        u.mobile userMobile,
                        u.address userAddress,
                        u.image userImage
                    FROM bookings b
                    INNER JOIN mapping_hotel mh ON mh.code = b.hotelCode
                    LEFT JOIN ms_hotels h ON h.id = mh.masterId
                    INNER JOIN users u ON u.id = b.createdBy
                    LEFT JOIN country_code co ON co.isoId COLLATE utf8mb4_general_ci = h.countryId
                    LEFT JOIN city_code ci ON ci.code COLLATE utf8mb4_general_ci = h.cityId
                    
                    WHERE b.bookingId = '${req.params.id}'
                        AND b.status = '1'
                `);

                    const guests = await bookingGuestModel.findAll({ where: { bookingId: req.params.id } })
                    console.log((local[0]))
                    res.status(200).send(responseSuccess('successfully retrieving', {
                        ...newDetailObjects[0],
                        local: {
                            ...local[0],
                            bookingRoomDetail: local[0]?.bookingRoomDetail ?? "",
                            bookingAdditionalRequest: local[0]?.bookingAdditionalRequest ?? "",
                            guests,
                        },
                    }))
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
        let bookingObjects = {};

        const data = await supplierApiModel.findOne({
            attributes: ['id', 'supplierId', 'name', 'url', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            where: {
                supplierId: req.body.supplierId,
                name: 'Cancel'
            },
        });

        if (!data || data.length === 0) {
            return res.status(404).send(responseError('You need to make an cancel API.'));
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

        // Parse the JSON string in the body
        const bodyData = JSON.parse(responseData.body);

        if (bodyData.Login) {
            // Replace placeholders in the Login object with actual values from the current item
            bodyData.Login.AgencyCode = responseData.code;
            bodyData.Login.Username = responseData.user;
            bodyData.Login.Password = responseData.password;

            bodyData.MGBookingID = req.params.id;
            bodyData.AgencyBookingID = req.params.agencyBookingId ?? "";
            bodyData.SimulationFlag = false;
            bodyData.CancelDate = moment().format('YYYY-MM-DD');
            bodyData.Language = "EN";
            bodyData.DetailLevel = "FULL";
        }
        if (bodyData.Header) {

            // Replace placeholders in bodyData with actual values from responseData
            bodyData.Header.ClientID = responseData.user;
            bodyData.Header.LicenseKey = responseData.password;

            bodyData.BookingID = req.params.id;
        }

        // Transform bodyData into the data field of the config object
        const configData = {
            ...bodyData,
        };
        console.log(configData)
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

                if (data.data.status) {
                    await bookingModel.update({
                        bookingStatus: "CANCELCONF",
                    }, { where: { bookingId: req.params.id } })

                    res.status(200).send(responseSuccess('successfully cancel', data?.data?.bookingDetails))
                } else if (data.data.Success) {
                    await bookingModel.update({
                        bookingStatus: "CANCELCONF",
                    }, { where: { bookingId: req.params.id } })

                    const confirm = {
                        method: `${responseData.method}`,
                        url: `${responseData.supplier.urlApi}${"api/booking/HotelBookingCancelConfirm?$format=json"}`,
                        data: {

                            "Header": {
                                "LicenseKey": responseData.user,
                                "ClientID": responseData.password
                            },
                            "ConfirmID": data.data.Success.ConfirmID,
                            "BookingID": data.data.Success.BookingID

                        },
                        headers: {
                            'Accept': 'application/json',
                            'Accept-Encoding': 'gzip, deflate, br'
                        }
                    };

                    axios(confirm)
                        .then(async function (data) {
                            res.status(200).send(responseSuccess('successfully cancel', req.params.id))
                        })

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