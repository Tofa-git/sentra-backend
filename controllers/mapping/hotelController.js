"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const { Op } = require('sequelize');
const supplierModel = db.supplier;
const mappingHotelModel = db.mappingHotel;
const countryDataModel = db.mappingCountry;
const cityDataModel = db.mappingCity;
const hotelRoomModel = db.hotelRoom;
const hotelMasterModel = db.masterHotel;
const supplierApiModel = db.supplierApi;
const generalConfig = require('../../config/generalConfig');
const file = require('../../config/file');
const { success, error, validation } = require("../../utils/responseApi");
const { responseSuccess, responseError } = require('../../utils/response');
const { paginattionGenerator } = require('../../utils/pagination');
var axios = require('axios');

function replaceWordsWith(data, from, to) {
    if (typeof data === 'object') {
        if (Array.isArray(data)) {
            return data.map((item) => replaceWordsWith(item, from, to));
        } else {
            const newData = {};
            for (let key in data) {
                const newKey = key.replace(from, to);
                newData[newKey] = replaceWordsWith(data[key], from, to);
            }
            return newData;
        }
    } else if (typeof data === 'string') {
        return data.replace(from, to);
    } else {
        return data;
    }
}

// Function to generate a random filename
const generateRandomFilename = (type) => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    return `${timestamp}_${randomString}_${type}.png`;
};

const syncMappingHotel = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const data = await supplierApiModel.findOne({
            attributes: ['id', 'supplierId', 'name', 'url', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            where: {
                supplierId: id,
                name: 'Hotel' // Add the condition where name = 'Hotel'
            },
        });

        if (!data) {
            return res.status(404).send(responseError('Data not found.'));
        }

        // Decrypt the encrypted attributes
        const decryptedData = {
            id: data.id,
            supplierId: data.supplierId,
            name: data.name,
            endpoint: generalConfig.decryptData(data.endpoint),
            url: generalConfig.decryptData(data.url),
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

        // Check if the Login object exists in the bodyData
        if (bodyData.Login) {
            // Replace placeholders in bodyData with actual values from responseData
            bodyData.Login.AgencyCode = responseData.code;
            bodyData.Login.Username = responseData.user;
            bodyData.Login.Password = responseData.password;
        }

        if (bodyData.Country) {
            bodyData.Country = req.body?.Country;
        }

        if (bodyData.City) {
            bodyData.City = req.body?.City;
        }

        if (bodyData.Hotels.Code) {
            bodyData.Hotels.Code = req.body?.Code ?? [];
        }

        // Transform bodyData into the data field of the config object
        const configData = {
            ...bodyData,
        };

        const url = responseData.url.length > 0 ? responseData.url : responseData.supplier.urlApi;
        // Merge the configData with the other properties of the config object
        const config = {
            method: 'post',
            url: `${url}${responseData.endpoint}`,
            data: configData,
            headers: {
                'Accept': 'application/json'
            }
        };
        axios(config)
            .then(async function (response) {
                const hotels = response.data.hotels?.hotel ?? [];
                const newHotelObjects = [];

                for (const hotel of hotels) {
                    const countryData = await countryDataModel.findOne({
                        where: {
                            code: hotel.address.countryCode,
                            supplierId: responseData.supplierId,
                        },
                    });

                    const cityData = await cityDataModel.findOne({
                        where: {
                            code: hotel.address.cityCode,
                            supplierId: responseData.supplierId,
                        },
                    });

                    const existingHotel = await hotelMasterModel.findOne({
                        where: {
                            name: {
                                [Op.like]: `%${hotel.name}%`,
                            },
                        },
                    });

                    // Extract the numeric part from the "rating" field
                    const ratingMatches = hotel.rating.match(/\d+/);
                    const star = ratingMatches ? ratingMatches[0] : "-";
                    const noOfRooms = isNaN(hotel.noOfRooms) ? 0 : parseInt(hotel.noOfRooms);

                    if (!existingHotel) {

                        const hotelData = {
                            countryId: countryData.id,
                            cityId: cityData.id,
                            code: hotel.code,
                            name: hotel.name,
                            address: hotel.address.line1 ?? "-", // Assuming address is in the form of an object
                            continent: hotel.address.continentName ?? "-",
                            zipCode: hotel.address.zipCode ?? "-",
                            latitude: parseFloat(hotel.geoLocation.latitude) ?? 0,
                            longitude: parseFloat(hotel.geoLocation.longitude) ?? 0,
                            checkInTime: hotel.checkInTime ?? "-",
                            checkOutTime: hotel.checkOutTime ?? "-",
                            shortDescription: (hotel.shortDescription === "NA" || hotel.shortDescription === "N/A") ? "-" : hotel.shortDescription,
                            longDescription: (hotel.longDescription === "NA" || hotel.longDescription === "N/A") ? "-" : hotel.longDescription,
                            email: (hotel.reservation.email === "NA" || hotel.reservation.email === "N/A" || hotel.reservation.email === "") ? "-" : hotel.reservation.email,
                            phone: (hotel.reservation.telephone === "NA" || hotel.reservation.telephone === "N/A" || hotel.reservation.telephone === "") ? "-" : hotel.reservation.telephone,
                            website: (hotel.webSite === "NA" || hotel.webSite === "N/A" || hotel.webSite === "") ? "-" : hotel.webSite,
                            star: star,
                            totalRoom: noOfRooms,
                            extra: (hotel.extra === "NA" || hotel.extra === "N/A" || hotel.extra === "") ? "-" : hotel.extra,
                            chainCode: (hotel.chainCode === "NA" || hotel.chainCode === "N/A" || hotel.chainCode === "") ? "-" : hotel.chainCode,
                            chainName: (hotel.chainName === "NA" || hotel.chainName === "N/A" || hotel.chainName === "") ? "-" : hotel.chainName,
                            brandCode: (hotel.brandCode === "NA" || hotel.brandCode === "N/A" || hotel.brandCode === "") ? "-" : hotel.brandCode,
                            brandName: (hotel.brandName === "NA" || hotel.brandName === "N/A" || hotel.brandName === "") ? "-" : hotel.brandName,
                            type: (hotel.type === "NA" || hotel.type === "N/A" || hotel.type === "") ? "-" : hotel.type,
                            status: '1',
                            createdBy: req.user.id,
                        };

                        const createdHotel = await hotelMasterModel.create(hotelData);

                        newHotelObjects.push({
                            supplierId: responseData.supplierId,
                            masterId: createdHotel.id,
                            countryId: countryData.id,
                            cityId: cityData.id,
                            cityName: hotel.City ?? "-",
                            cityCode: hotel.CityCode ?? "-",
                            name: hotel.name,
                            code: hotel.code,
                            address: hotel.address.line1 ?? "-", // Assuming address is in the form of an object
                            zipCode: hotel.address.zipCode ?? "-",
                            latitude: parseFloat(hotel.geoLocation.latitude) ?? 0,
                            longitude: parseFloat(hotel.geoLocation.longitude) ?? 0,
                            phone: (hotel.reservation.telephone === "NA" || hotel.reservation.telephone === "N/A" || hotel.reservation.telephone === "") ? "-" : hotel.reservation.telephone,
                            chainCode: (hotel.chainCode === "NA" || hotel.chainCode === "N/A" || hotel.chainCode === "") ? "-" : hotel.chainCode,
                            chainName: (hotel.chainName === "NA" || hotel.chainName === "N/A" || hotel.chainName === "") ? "-" : hotel.chainName,
                            brandCode: (hotel.brandCode === "NA" || hotel.brandCode === "N/A" || hotel.brandCode === "") ? "-" : hotel.brandCode,
                            brandName: (hotel.brandName === "NA" || hotel.brandName === "N/A" || hotel.brandName === "") ? "-" : hotel.brandName,
                            type: (hotel.type === "NA" || hotel.type === "N/A" || hotel.type === "") ? "-" : hotel.type,
                            star: star,
                            status: '1',
                            createdBy: req.user.id,
                        });

                        // Download and save hotel images
                        if (hotel.photos && hotel.photos.image && hotel.photos.image.length > 0) {

                            for (const image of hotel.photos.image) {
                                if (image.url) {
                                    const imageUrl = image.url;
                                    const imageFilename = generateRandomFilename("Hotel");
                                    await file.downloadAndSaveImageHotel(imageUrl, imageFilename, req.user.id, createdHotel.id, req);
                                }
                            }
                        }

                        // Iterate through rooms and download room images
                        if (hotel.rooms && hotel.rooms.room && hotel.rooms.room.length > 0) {
                            for (const room of hotel.rooms.room) {

                                const hotelRoom = {
                                    hotelId: createdHotel.id,
                                    code: room.code,
                                    name: room.name,
                                    size: room.size,
                                    maxOccupancy: room.maxOccupancy,
                                    maxAdult: room.maxAdult,
                                    isSmokingAllowed: room.isSmokingAllowed,
                                    status: '1',
                                    createdBy: req.user.id,
                                };

                                const createdRoom = await hotelRoomModel.create(hotelRoom);

                                if (room.photos.image && room.photos.image.length > 0) {
                                    for (const image of room.photos.image) {
                                        if (image.url) {
                                            const imageUrl = image.url;
                                            const imageFilename = generateRandomFilename("Room");
                                            await file.downloadAndSaveImageRoom(imageUrl, imageFilename, req.user.id, createdHotel.id, createdRoom.id, room.photos.isMain ?? "false", req);
                                        }
                                    }
                                }
                            }
                        }

                    } else {
                        console.log('Hotel with the same code already exists');
                        // Handle the case when the hotel already exists (e.g., show a message or log)
                    }
                }

                // Find the existing hotels in the mapping_hotel table with matching codes
                const existingHotels = await mappingHotelModel.findAll({
                    where: {
                        code: newHotelObjects.map((hotel) => hotel.code),
                        supplierId: responseData.supplierId,
                    },
                });

                // Build a mapping of code to id for existing hotels
                const codeToIdMap = {};
                existingHotels.forEach((existingHotel) => {
                    codeToIdMap[existingHotel.code] = existingHotel.id;
                });

                // Filter out the new hotels that are not in the existing mapping_hotel table
                const newHotels = newHotelObjects.filter((hotel) => !codeToIdMap[hotel.code]);

                // Insert or update the data in the mapping_hotel table using bulkCreate with updateOnDuplicate option
                await mappingHotelModel.bulkCreate(newHotels, {
                    updateOnDuplicate: ['name', 'code', 'masterId', 'supplierId'],
                });
            })
            .catch(function (error) {
                res.status(500).send(responseError(error));
            });


        res.status(200).send(responseSuccess('Data found.', responseData));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
};

const showMappingHotel = async (req, res, next) => {
    try {
        const whereConditions = {
            supplierId: req.body.supplierId,
            [Op.or]: [
                {
                    code: {
                        [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                    },
                },
                {
                    name: {
                        [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                    },
                },
            ],
        };

        // Add countryId to whereConditions if it exists in req.body
        if (req.body.countryId) {
            whereConditions.countryId = req.body.countryId;
        }

        // Add cityId to whereConditions if it exists in req.body
        if (req.body.cityId) {
            whereConditions.cityId = req.body.cityId;
        }

        // Add isShow to whereConditions if it exists in req.body
        if (req.body.isShow === true) {            
            whereConditions.masterId = {
                [Op.ne]: 0, // Filter out rows where masterId is not equal to 0
            };
        }
        
        const data = await mappingHotelModel.findAndCountAll({
            attributes: [
                'id',
                'countryId',
                'cityId',
                'supplierId',
                'masterId',
                'code',
                'name',
                'address',
                'zipCode',
                'latitude',
                'longitude',
                'phone',
                'star',
                'chainCode',
                'chainName',
                'brandCode',
                'brandName',
                'createdBy',
                'updatedBy',
            ],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
            where: whereConditions,
            order: [
                ['code', 'ASC'], // Sort by short_name in ascending order
            ],
        });

        // Retrieve the suppman data for each entry
        const responseData = await Promise.all(
            data.rows.map(async (entry) => {
                
                const supplier = await supplierModel.findOne({
                    where: { id: entry.supplierId },
                    attributes: ['id', 'code', 'name', 'creditDay', 'status'],
                });

                const master = await hotelMasterModel.findOne({
                    where: { id: entry.masterId },
                    attributes: [
                        'id',
                        'code',
                        'name',
                        'shortDescription',
                        'longDescription',
                        'star',
                        'totalRoom',
                        'chainCode',
                        'chainName',
                        'brandCode',
                        'brandName',
                        'status'
                    ],
                });

                const masterCountry = await countryDataModel.findOne({
                    where: { id: entry.countryId },
                    attributes: ['id', 'code', 'name', 'status'],
                });

                const masterCity = await cityDataModel.findOne({
                    where: { id: entry.cityId },
                    attributes: ['id', 'code', 'name', 'status'],
                });

                return {
                    ...entry.toJSON(),
                    master: master,
                    country: masterCountry,
                    city: masterCity,
                    supplier: supplier,
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
};

const createHotel = async (req, res) => {

    if (req.body && Array.isArray(req.body)) {
        const hotels = req.body.map(
            async hotel => {

                const countryData = await countryDataModel.findOne({
                    where: {
                        code: hotel.address.countryCode,
                    },
                });

                const cityData = await cityDataModel.findOne({
                    where: {
                        code: hotel.address.cityCode,
                    },
                });

                const existingHotel = await hotelMasterModel.findOne({
                    where: {
                        name: {
                            [Op.like]: `%${hotel.name}%`,
                        },
                    },
                });

                return {
                    supplierId: responseData.supplierId,
                    masterId: createdHotel.id,
                    countryId: countryData.id,
                    cityId: cityData.id,
                    name: hotel.name,
                    code: hotel.code,
                    address: hotel.address.line1 ?? "-", // Assuming address is in the form of an object
                    zipCode: hotel.address.zipCode ?? "-",
                    latitude: parseFloat(hotel.geoLocation.latitude) ?? 0,
                    longitude: parseFloat(hotel.geoLocation.longitude) ?? 0,
                    phone: (hotel.reservation.telephone === "NA" || hotel.reservation.telephone === "N/A" || hotel.reservation.telephone === "") ? "-" : hotel.reservation.telephone,
                    chainCode: (hotel.chainCode === "NA" || hotel.chainCode === "N/A" || hotel.chainCode === "") ? "-" : hotel.chainCode,
                    chainName: (hotel.chainName === "NA" || hotel.chainName === "N/A" || hotel.chainName === "") ? "-" : hotel.chainName,
                    brandCode: (hotel.brandCode === "NA" || hotel.brandCode === "N/A" || hotel.brandCode === "") ? "-" : hotel.brandCode,
                    brandName: (hotel.brandName === "NA" || hotel.brandName === "N/A" || hotel.brandName === "") ? "-" : hotel.brandName,
                    type: (hotel.type === "NA" || hotel.type === "N/A" || hotel.type === "") ? "-" : hotel.type,
                    star: star,
                    status: '1',
                    createdBy: req.user.id,
                }
            });


        try {
            await mappingHotelModel.bulkCreate(hotels).then(data => {
                res.status(201).send({ data: data, message: 'user sales created successfully' });
            })
                .catch(err => {
                    res.status(500).send({
                        data: null,
                        message:
                            err.message =
                            "Validation Error" ? err.message : "Some error occurred while creating the Users."
                    });
                    console.log(err)
                });
        } catch (error) {
            return [false, 'Unable to sign up, Please try again later', error];
        }

    }
}

const createHotelDida = async (req, res) => {
    const hotelObjects = req.body.map(async (hotel) => {
        const countryData = await countryDataModel.findOne({
            where: {
                code: hotel.CountryCode,
                supplierId: req.query.supplierId,
            },
        });

        const cityData = await cityDataModel.findOne({
            where: {
                code: hotel.DestinationCode,
                supplierId: req.query.supplierId,
            },
        });

        const existingHotel = await hotelMasterModel.findOne({
            where: {
                name: {
                    [Op.like]: `%${hotel.HotelName}%`,
                },
            },
        });

        const existingMappingHotel = await mappingHotelModel.findOne({
            where: {
                [Op.and]: [
                    { name: hotel.HotelName },
                ],
            },
        });

        if (existingMappingHotel == null) {
            return {
                supplierId: '5',
                masterId: existingHotel != null ? existingHotel.id : 0,
                countryId: countryData != null ? countryData.id : 1,
                cityId: cityData != null ? cityData.id : 1,
                cityName: hotel.City,
                cityCode: hotel.CityCode,
                name: hotel.HotelName,
                code: hotel.DidaHotelID,
                address: hotel.Address ?? "-",
                zipCode: hotel.ZipCode ?? "-",
                latitude: parseFloat(hotel.Latitude) ?? 0,
                longitude: parseFloat(hotel.Longitude) ?? 0,
                phone: (hotel.telephone === null || hotel.telephone === "N/A" || hotel.telephone === "") ? "-" : hotel.telephone,
                chainCode: (hotel.HotelChain === null || hotel.HotelChain === "N/A" || hotel.HotelChain === "") ? "-" : hotel.HotelChain,
                chainName: (hotel.HotelChain === null || hotel.HotelChain === "N/A" || hotel.HotelChain === "") ? "-" : hotel.HotelChain,
                brandCode: (hotel.SubHotelChain === null || hotel.SubHotelChain === "N/A" || hotel.SubHotelChain === "") ? "-" : hotel.SubHotelChain,
                brandName: (hotel.SubHotelChain === null || hotel.SubHotelChain === "N/A" || hotel.SubHotelChain === "") ? "-" : hotel.SubHotelChain,
                type: (hotel.HotelCategory === null || hotel.HotelCategory === "N/A" || hotel.HotelCategory === "") ? "-" : hotel.HotelCategory,
                star: hotel.StarRating,
                status: '1',
                createdBy: req.user.id,
            };
        }

    });

    try {
        const hotels = await Promise.all(hotelObjects);
        await mappingHotelModel.bulkCreate(hotels).then((data) => {
            res.status(201).send({ data: data, message: 'Hotels created successfully' });
        }).catch((err) => {
            res.status(500).send({
                data: null,
                message: err.name === "SequelizeUniqueConstraintError" ? "Hotel with the same name already exists" : "Some error occurred while creating the Hotels."
            });
            console.log(err);
        });
    } catch (error) {
        res.status(500).send({
            data: null,
            message: 'Unable to create hotels, Please try again later',
            error: error.message
        });
    }

}

const updateHotel = async (req, res) => {
    try {
        await mappingHotelModel.update({
            masterId: req.body.masterId,
            // countryId:req.body.countryId,
            // cityId:req.body.cityId,
            // cityName:req.body.cityName,
            // cityCode:req.body.cityCode,
            name: req.body.name,
            code: req.body.code,
            phone: req.body.phone,
            address: req.body.address,
            zipCode: req.body.zipCode,
            star: req.body.star,
            chainCode: req.body.chainCode,
            chainName: req.body.chainName,
            brandCode: req.body.brandCode,
            brandName: req.body.brandName,
            type: req.body.type,
            status: req.body.status,
            updatedBy: req.user.id,
        },
            { where: { id: req.params.id } },)

        res.status(201).send(responseSuccess('Data updated successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }

}

const destroyHotel = async (req, res) => {
    try {
        await mappingHotelModel.destroy({ where: { id: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const listDropdown = async (req, res) => {
    try {
        const data = await mappingHotelModel.findAll({
            attributes: [
                'id',
                'supplierId',
                'masterId',
                'countryId',
                'cityId',
                'name',
                'code'
            ],
            where: {
                [Op.or]: [
                    {
                        supplierId: {
                            [Op.eq]: [req.query.supplierId ?? "",],
                        },
                    },
                    {
                        countryId: {
                            [Op.eq]: [req.query.countryId ?? ""],
                        },
                    },
                    {
                        cityId: {
                            [Op.eq]: [req.query.cityId ?? ""],
                        },
                    },
                ]
            },
        });

        res.status(200).send(responseSuccess('Success', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const listDropdownById = async (req, res) => {
    try {
        const data = await hotelMasterModel.findAll({
            attributes: [
                'id',
                'code',
                'name',
                'address',
                'zipCode',
                'latitude',
                'longitude',
                'phone',
                'star',
                'chainCode',
                'chainName',
                'brandCode',
                'brandName',
            ],
            where: {
                [Op.or]: [
                    {
                        code: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    },
                    {
                        name: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    }
                ]
            },
        });

        res.status(200).send(responseSuccess('Success', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}


module.exports = {
    syncMappingHotel,
    showMappingHotel,
    createHotel,
    createHotelDida,
    updateHotel,
    destroyHotel,
    listDropdown,
    listDropdownById,
}