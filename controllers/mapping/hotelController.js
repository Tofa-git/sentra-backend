"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const { Op } = require('sequelize');
const supplierModel = db.supplier;
const mappingHotelModel = db.mappingHotel;
const countryDataModel = db.mappingCountry;
const cityDataModel = db.mappingCity;
const hotelDataModel = db.mappingHotel;
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
        console.log(config)
        axios(config)
            .then(async function (response) {
                const hotels = response.data.hotels?.hotel ?? [];
                const newHotelObjects = [];
                console.log(hotels)
                for (const hotel of hotels) {
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
                            email: hotel.reservation.email ?? "-",
                            phone: hotel.reservation.telephone ?? "-",
                            website: hotel.webSite ?? "-",
                            star: star,
                            totalRoom: noOfRooms,
                            status: '1',
                            createdBy: req.user.id,
                        };

                        const createdHotel = await hotelMasterModel.create(hotelData);

                        // Download and save hotel images
                        if (hotel.photos && hotel.photos.image && hotel.photos.image.length > 0) {
                            for (const image of hotel.photos.image) {
                                if (image.url) {
                                    const imageUrl = image.url;
                                    const imageFilename = generateRandomFilename("Hotel");
                                    await file.downloadAndSaveImageHotel(imageUrl, imageFilename,req.user.id,createHotel.id, req);                                    
                                }
                            }
                        }

                        // Iterate through rooms and download room images
                        if (hotel.rooms && hotel.rooms.room && hotel.rooms.room.length > 0) {
                            for (const room of hotel.rooms.room) {
                                if (room.photos.image && room.photos.image.length > 0) {
                                    for (const image of room.photos.image) {
                                        if (image.url) {
                                            const imageUrl = image.url;
                                            const imageFilename = generateRandomFilename("Room");
                                            await file.downloadAndSaveImageRoom(imageUrl, imageFilename,req.user.id,createHotel.id, req);
                                        }
                                    }
                                }
                            }
                        }

                        newHotelObjects.push({
                            supplierId: responseData.supplierId,
                            masterId: createdHotel.id,
                            countryId: countryData.id,
                            name: hotel.name,
                            code: hotel.code,
                            status: '1',
                            createdBy: req.user.id,
                        });
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
        const data = await mappingHotelModel.findAndCountAll({
            attributes: [
                'id',
                'supplierId',
                'masterId',
                'countryId',
                'code',
                'name',
                'status'
            ],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
            where: {
                supplierId: req.body.supplierId,
                [Op.and]: [
                    {
                        code: {
                            [Op.like]: ['%' + (req.query.code ?? '') + '%'],
                        },
                    },
                    {
                        name: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    },
                ]
            },
            order: [
                ['code', 'ASC'], // Sort by short_name in ascending order
            ],
        });

        // Retrieve the suppman data for each entry
        const responseData = await Promise.all(
            data.rows.map(async (entry) => {
                console.log(entry)
                const supplier = await supplierModel.findOne({
                    where: { id: entry.supplierId },
                    attributes: ['id', 'code', 'name', 'creditDay', 'status'],
                });

                const master = await hotelDataModel.findOne({
                    where: { id: entry.masterId },
                    attributes: ['id', 'countryId', 'code', 'short_name', 'status'],
                });

                const masterCountry = await countryDataModel.findOne({
                    where: { id: entry.countryId },
                    attributes: ['id', 'isoId', 'iso3', 'name', 'status'],
                });

                const masterWithHotel = await Promise.all(
                    [master].map(async (master) => {
                        const countryData = await countryDataModel.findOne({
                            where: { id: master.countryId },
                            attributes: ['isoId', 'iso3', 'name'],
                        });

                        return {
                            ...master.toJSON(),
                            ...countryData.toJSON(),
                        };
                    })
                );


                return {
                    ...entry.toJSON(),
                    master: masterWithHotel,
                    masterCountry: masterCountry,
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
    try {
        await mappingHotelModel.create({
            supplierId: req.body.supplierId,
            masterId: req.body.masterId,
            countryId: req.body.countryId,
            name: req.body.name,
            code: req.body.code,
            status: req.body.status,
            createdBy: req.user.id,
        })

        res.status(201).send(responseSuccess('Data created successfully'));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
}

const updateHotel = async (req, res) => {
    try {
        await mappingHotelModel.update({
            supplierId: req.body.supplierId,
            masterId: req.body.masterId,
            countryId: req.body.countryId,
            name: req.body.name,
            code: req.body.code,
            status: req.body.status,
            updatedBy: req.user.id,
        }, { where: { id: req.params.id } })

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


module.exports = {
    syncMappingHotel,
    showMappingHotel,
    createHotel,
    updateHotel,
    destroyHotel,
}