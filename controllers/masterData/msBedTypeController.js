"use strict"

const { Op } = require('sequelize');
const db = require('../../config/sequelize');
const { responseSuccess, responseError } = require('../../utils/response');
const { paginattionGenerator } = require('../../utils/pagination');
const bedTypeModel = db.masterBedType;
const supplierModel = db.supplier;

const create = async (req, res) => {
    const userId = req.user.id;
    try {
        if (req.body && Array.isArray(req.body)) {
            const datas = req.body.map(
                data => {
                    return {
                        supplierId: data.supplierId ?? "",
                        occupancy: data.occupancy ?? "",
                        code: data.code ?? "",
                        name: data.name ?? "",
                        status: 1,
                        createdBy: userId,
                    }
                });
            await bedTypeModel.bulkCreate(datas).then(data => {
                res.status(201).send({ data: data, message: 'Data created successfully' });
            })
                .catch(err => {
                    res.status(500).send({
                        data: null,
                        message:
                            err.message =
                            "Validation Error" ? err.message : "Some error occurred while creating the data."
                    });
                });
        } else {
            await bedTypeModel.create({
                occupancy: req.body.occupancy,
                name: req.body.name,
                code: req.body.code,
                status: 1,
                createdBy: req.user.id,
            })

            res.status(201).send(responseSuccess('Data created successfully'));
        }



    } catch (error) {
        res.status(500).send(responseError(error));
    }
}

const list = async (req, res) => {
    try {
        const data = await bedTypeModel.findAndCountAll({
            attributes: [
                'id',
                'supplierId',
                'occupancy',
                'name',
                'code',
            ],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 10,
            where: {
                [Op.and]: [
                    {
                        name: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    },
                    {
                        code: {
                            [Op.like]: ['%' + (req.query.code ?? '') + '%'],
                        },
                    },
                ]
            }
        });

        // Retrieve the Supplier for each entry
        const responseData = await Promise.all(
            data.rows.map(async (entry) => {
                const supplier = await supplierModel.findOne({
                    where: { id: entry.supplierId },
                    attributes: ['id', 'code', 'name', 'creditDay', 'status'],
                });

                return {
                    ...entry.toJSON(),
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
}

const detail = async (req, res) => {
    try {
        const data = await bedTypeModel.findOne({
            attributes: [
                'id',
                'supplierId',
                'occupancy',
                'name',
                'code',
            ],
            where: {
                id: req.params.id,
            }
        });

        res.status(200).send(responseSuccess('Success', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const update = async (req, res) => {
    try {
        await bedTypeModel.update({
            name: req.body.name,
            occupancy: req.body.occupancy,
            code: req.body.code,
            updatedBy: req.user.id,
        }, { where: { id: req.params.id } })

        res.status(201).send(responseSuccess('Data updated successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const destroy = async (req, res) => {
    try {
        await bedTypeModel.destroy({ where: { id: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const listDropdown = async (req, res) => {
    try {
        const data = await bedTypeModel.findAll({
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

module.exports = {
    create,
    list,
    detail,
    update,
    destroy,
    listDropdown,
}