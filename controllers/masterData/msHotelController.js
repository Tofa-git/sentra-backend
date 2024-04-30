"use strict"

const { Op } = require('sequelize');
const db = require('../../config/sequelize');
const { responseSuccess, responseError } = require('../../utils/response');
const { paginattionGenerator } = require('../../utils/pagination');
const hotelModel = db.masterHotel;
const hotelPhotoModel = db.hotelPhoto;
const cityDataModel = db.cityCode;
const countryDataModel = db.countryCode;

const create = async (req, res) => {
    try {
        const hotel = await hotelModel.create({
            countryId: req.body.countryId,
            cityId: req.body.cityId,
            continent: req.body.continent,            
            name: req.body.name,
            code: req.body.name,
            email: req.body.email,
            phone: req.body.telephone,
            website: req.body.website,
            address: req.body.address,
            zipCode: req.body.zipCode,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            checkInTime: req.body.checkInTime,
            checkOutTime: req.body.checkOutTime,
            extra: req.body.extra,
            star: req.body.star,
            totalRoom: req.body.totalRoom,
            status: req.body.status,
            createdBy: req.user.id,
        })

        await uploadFiles(req, hotel.id);

        res.status(201).send(responseSuccess('Data created successfully', hotel));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
}

const list = async (req, res) => {
    try {
        const whereConditions = {            
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
         if (req.query.countryId) {
            whereConditions.countryId = req.query.countryId;
        }

        // Add cityId to whereConditions if it exists in req.body
        if (req.query.cityId) {
            whereConditions.cityId = req.query.cityId;
        }


        const data = await hotelModel.findAndCountAll({
            attributes: [
                'id',                
                'countryId',
                'cityId', 
                'code',
                'name',
                'status',                                
                'continent',
                'address',
                'zipCode',
                'latitude',
                'longitude',
                'checkInTime',
                'checkOutTime',
                'shortDescription',
                'longDescription',
                'extra',
                'email',
                'phone',
                'website',
                'youtube',
                'star',
                'totalRoom',
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
                ['name', 'ASC'], // Sort by short_name in ascending order
            ],
        });

       

         // Retrieve the suppman data for each entry
         const responseData = await Promise.all(
            data.rows.map(async (entry) => {
                
                const masterCountry = await countryDataModel.findOne({
                    where: { id: entry.countryId },
                    attributes: ['id', 'isoId', 'iso3', 'name','basicCurrency','descCurrency', 'status'],
                });
        
                const masterCity = await cityDataModel.findOne({
                    where: { id: entry.cityId },
                    attributes: ['id', 'code', 'long_name','short_name', 'status'],
                });
             
                return {
                    ...entry.toJSON(),                  
                    country: masterCountry,
                    city: masterCity,
                };
            })
        );

        const result = paginattionGenerator(req, {
            count: data.count,
            rows: responseData,
        });

        res.status(200).send(responseSuccess('Success', result));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const detail = async (req, res) => {
    try {
        const hotel = await hotelModel.findOne({
            attributes: [
                'countryId',
                'cityId',
                'continent',                
                'name',
                'code',
                'email',
                'phone',
                'website',
                'address',
                'zipCode',
                'latitude',
                'longitude',
                'checkInTime',
                'checkOutTime',
                'extra',
                'star',
                'totalRoom',
                'status',
                'createdBy',
            ],
            where: {
                id: req.params.id,
            },
        });

        const [photos] = await db.sequelize.query(`
            SELECT p.id, p.isMain, f.url
            FROM hotel_photos p
            INNER JOIN ms_files f ON f.id = p.fileId
            WHERE p.hotelId = '${req.params.id}'
        `);

        const data = {
            ...hotel?.dataValues,
            photos,
        }

        res.status(200).send(responseSuccess('Success', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const update = async (req, res) => {
    try {
        await hotelModel.update({
            countryId: req.body.countryId,
            cityId: req.body.cityId,
            ccontinent: req.body.cityId,            
            name: req.body.name,
            code: req.body.code,
            email: req.body.email,
            phone: req.body.telephone,
            website: req.body.website,
            address: req.body.address,
            zipCode: req.body.zipCode,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            checkInTime: req.body.checkInTime,
            checkOutTime: req.body.checkOutTime,
            extra: req.body.extra,
            star: req.body.star,
            totalRoom: req.body.totalRoom,
            status: req.body.status,
            updatedBy: req.user.id,
        }, { where: { id: req.params.id } })

        await hotelPhotoModel.destroy({ where: { hotelId: req.params.id } });
        await uploadFiles(req, req.params.id);

        res.status(201).send(responseSuccess('Data updated successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const destroy = async (req, res) => {
    try {
        await hotelModel.destroy({ where: { id: req.params.id } });
        await hotelPhotoModel.destroy({ where: { hotelId: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const listDropdown = async (req, res) => {
    try {
        const data = await hotelModel.findAll({
            attributes: [
                'id',
                'name',
            ],
        });
        res.status(200).send(responseSuccess('Success', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const uploadFiles = async (req, hotelId) => {
    let files = [];
    req.body.fileIds.map(v => {
        files.push({
            hotelId,
            fileId: v.id,
            isMain: v.isMain,
            createdBy: req.user.id,
        })
    })

    hotelPhotoModel.bulkCreate(files);
}

module.exports = {
    create,
    list,
    detail,
    update,
    destroy,
    listDropdown,
}