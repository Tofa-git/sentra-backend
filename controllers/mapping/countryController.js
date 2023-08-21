"use strict"

const db = require('../../config/sequelize');
// const bcrypt = require('bcrypt');
const constants = require('../../config/constants');
const { Op } = require('sequelize');
const supplierModel = db.supplier;
const mappingCountryModel = db.mappingCountry;
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

const syncMappingCountry = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const data = await supplierApiModel.findOne({
            attributes: ['id', 'supplierId', 'name', 'url','endpoint', 'method', 'code', 'user', 'password', 'body', 'status'],
            where: {
                supplierId: id,
                name: 'Country' // Add the condition where name = 'Country'
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

        // Transform bodyData into the data field of the config object
        const configData = {
            ...bodyData,
        };

        // Merge the configData with the other properties of the config object
        const config = {
            method: 'post',
            url: `${responseData.supplier.urlApi}${responseData.endpoint}`,
            data: configData,
            headers: {
                'Accept': 'application/json'
            }
        };

        axios(config)
            .then(async function (response) {
                if (response.data.nationalityTypes.nationalityType) {
                    // const replacedResponse = replaceWordsWith(response, 'nationalityTypes', 'response');
                    // console.log(replacedResponse)
                    const countriesArray = response.data.nationalityTypes.nationalityType;
                    const countryCodes = countriesArray.map((country) => country.code);

                    // Find the existing countries in the mapping_country table with matching codes
                    const existingCountries = await mappingCountryModel.findAll({
                        where: {
                            code: countryCodes,
                            supplierId: responseData.supplierId,
                        },
                    });

                    // Build a mapping of code to id for existing countries
                    const codeToIdMap = {};
                    existingCountries.forEach((existingCountry) => {
                        codeToIdMap[existingCountry.code] = existingCountry.id;
                    });

                    const newCountryObjects = [];

                    // Filter out the new countries that are not in the existing mapping_country table
                    const newCountries = countriesArray.filter((country) => !codeToIdMap[country.code]);

                    // Fetch the id for new countries from the country_code table
                    for (const country of newCountries) {
                        const countryData = await countryDataModel.findOne({
                            where: {
                                isoId: country.code,
                            },
                        });

                        if (countryData) {
                            // Set the masterId based on the existing country's ID from the country_code table
                            newCountryObjects.push({
                                supplierId: responseData.supplierId,
                                masterId: countryData.id,
                                name: country.name,
                                code: country.code,
                                status: '1', // Set the status accordingly
                                createdBy: req.user.id, // Set the createdBy field to the ID of the current user
                            });
                        }
                    }

                    // Insert or update the data in the mapping_country table using bulkCreate with updateOnDuplicate option
                    await mappingCountryModel.bulkCreate(newCountryObjects, {
                        updateOnDuplicate: ['name', 'code', 'masterId', 'supplierId'],
                    });

                }

            })
            .catch(function (error) {
                res.status(500).send(responseError(error));
            });

        res.status(200).send(responseSuccess('Data found.', responseData));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
};

const showMappingCountry = async (req, res, next) => {
    try {
        const data = await mappingCountryModel.findAndCountAll({
            attributes: [
                'id',
                'supplierId',
                'masterId',
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
            }
        });

        // Retrieve the suppman data for each entry
        const responseData = await Promise.all(
            data.rows.map(async (entry) => {
                const supplier = await supplierModel.findOne({
                    where: { id: entry.supplierId },
                    attributes: ['id', 'code', 'name', 'creditDay', 'status'],
                });

                const master = await countryDataModel.findOne({
                    where: { id: entry.masterId },
                    attributes: ['id', 'isoid', 'iso3', 'name', 'status'],
                });

                return {
                    ...entry.toJSON(),
                    master: master,
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

const createCountry = async (req, res) => {
    try {
        await mappingCountryModel.create({
            supplierId: req.body.supplierId,
            masterId: req.body.masterId,
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

const updateCountry = async (req, res) => {
    try {
        await mappingCountryModel.update({
            supplierId: req.body.supplierId,
            masterId: req.body.masterId,
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

const destroyCountry = async (req, res) => {
    try {
        await mappingCountryModel.destroy({ where: { id: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}


module.exports = {
    syncMappingCountry,
    showMappingCountry,
    createCountry,
    updateCountry,
    destroyCountry,
}