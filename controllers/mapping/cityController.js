"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const { Op } = require('sequelize');
const supplierModel = db.supplier;
const mappingCityModel = db.mappingCity;
const countryDataModel = db.countryCode;
const cityDataModel = db.cityCode;
const supplierApiModel = db.supplierApi;
const generalConfig = require('../../config/generalConfig');
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

const syncMappingCity = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const data = await supplierApiModel.findOne({
            attributes: ['id', 'supplierId', 'name', 'url', 'endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            where: {
                supplierId: id,
                name: 'City' // Add the condition where name = 'City'
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

        if (bodyData.Continent) {            
            bodyData.Continent = req.body?.Continent ?? "";            
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
                const continents = response.data.continents?.continent ?? [];
                const newCityObjects = [];
                console.log(response.data)
                for (const continent of continents) {
                    const countries = continent.countries?.country ?? [];

                    for (const country of countries) {
                        const cities = country.cities?.city ?? [];
                        const countryData = await countryDataModel.findOne({
                            where: {
                                isoId: country.code,
                            },
                        });

                        if (countryData) {
                            for (const city of cities) {
                                const cityData = await cityDataModel.findOne({
                                    where: {
                                        short_name: city.name,
                                    },
                                });
                                if (cityData) {
                                    newCityObjects.push({
                                        supplierId: responseData.supplierId,
                                        masterId: cityData.id,
                                        countryId: countryData.id,
                                        name: city.name,
                                        code: city.code,
                                        status: '1',
                                        createdBy: req.user.id,
                                    });
                                }

                                const existingCity = await cityDataModel.findOne({
                                    where: {
                                        [Op.or]: [
                                            { countryId: countryData.id },
                                            { code: city.code },
                                            { long_name: city.name + "," + country.name },
                                            { short_name: city.name },
                                        ],
                                    },
                                });

                                if (!existingCity) {
                                    await cityDataModel.create({
                                        countryId: countryData.id,
                                        sequence: 9999,
                                        code: city.code,
                                        long_name: city.name + "," + country.name,
                                        short_name: city.name,
                                        status: 1,
                                        createdBy: req.user.id,
                                    });
                                } else {
                                    console.log('City with the same code, long_name, or short_name already exists');
                                    // Handle the case when the city already exists (e.g., show a message or log)
                                }


                            }
                        }

                    }
                }

                // Find the existing cities in the mapping_city table with matching codes
                const existingCities = await mappingCityModel.findAll({
                    where: {
                        code: newCityObjects.map((city) => city.code),
                        supplierId: responseData.supplierId,
                    },
                });


                // Build a mapping of code to id for existing cities
                const codeToIdMap = {};
                existingCities.forEach((existingCity) => {
                    codeToIdMap[existingCity.code] = existingCity.id;
                });

                // Filter out the new cities that are not in the existing mapping_city table
                const newCities = newCityObjects.filter((city) => !codeToIdMap[city.code]);

                // Insert or update the data in the mapping_country table using bulkCreate with updateOnDuplicate option
                await mappingCityModel.bulkCreate(newCities, {
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

const showMappingCity = async (req, res, next) => {
    try {
        const data = await mappingCityModel.findAndCountAll({
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

                const master = await cityDataModel.findOne({
                    where: { id: entry.masterId },
                    attributes: ['id', 'countryId', 'code', 'short_name', 'status'],
                });

                const masterCountry = await countryDataModel.findOne({
                    where: { id: entry.countryId },
                    attributes: ['id', 'isoId', 'iso3', 'name', 'status'],
                });

                const masterWithCity = await Promise.all(
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
                    master: masterWithCity,
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

const createCity = async (req, res) => {
    try {
        await mappingCityModel.create({
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

const updateCity = async (req, res) => {
    try {
        await mappingCityModel.update({
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

const destroyCity = async (req, res) => {
    try {
        await mappingCityModel.destroy({ where: { id: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}


module.exports = {
    syncMappingCity,
    showMappingCity,
    createCity,
    updateCity,
    destroyCity,
}