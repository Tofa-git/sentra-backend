"use strict"

const { Op } = require('sequelize');
const db = require('../../config/sequelize');
const { paginattionGenerator } = require('../../utils/pagination');
const { responseSuccess, responseError } = require('../../utils/response');
const pivotModel = db.pivot;

const create = async (req, res) => {
    try {
        const newData = {
            Material: req.body.material,
            PartNumber: req.body.partNumber,
            Mnemonic: req.body.mnemonic,
            Description: req.body.description,
            NetPrice: req.body.netPrice,
            Plant: req.body.plant,
            Pgr: req.body.pgr,
            PRNumber: req.body.prNumber,
            PRType: req.body.prType,
            PRDate: req.body.prDate,
            PRQty: req.body.prQty,
            PRFullApproveLeadTime: req.body.prFullApproveLeadTime,
            Uom: req.body.uom,
            Vendor: req.body.vendor,
            VendorName: req.body.vendorName,
            PONumber: req.body.poNumber,
            POType: req.body.poType,
            PODate: req.body.poDate,
            DeliveryDate: req.body.deliveryDate,
            POQty: req.body.poQty,
            PRToPOLeadTime: req.body.prToPOLeadTime,
            POFullApproveLeadTime: req.body.poFullApproveLeadTime,
            GRNumber: req.body.grNumber,
            GRDate: req.body.grDate,
            QtyReceipt: req.body.qtyReceipt,
            DeliveryLeadTime: req.body.deliveryLeadTime,
            LeadTimeSupply: req.body.leadTimeSupply,
            TotalLeadTime: req.body.totalLeadTime,
            status: req.body.status,
            createdBy: req.user.id,
        };

        await pivotModel.create(newData);

        res.status(201).send(responseSuccess('Data created successfully'));
    } catch (error) {
        res.status(500).send(responseError(error));
    }
}

const list = async (req, res) => {
    try {
        const query = await pivotModel.findAndCountAll({
            attributes: [
                'id',
                'Material',
                'PartNumber',
                'Mnemonic',
                'Description',
                'NetPrice',
                'Plant',
                'Pgr',
                'PRNumber',
                'PRType',
                'PRDate',
                'PRQty',
                'PRFullApproveLeadTime',
                'Uom',
                'Vendor',
                'VendorName',
                'PONumber',
                'POType',
                'PODate',
                'DeliveryDate',
                'POQty',
                'PRToPOLeadTime',
                'POFullApproveLeadTime',
                'GRNumber',
                'GRDate',
                'QtyReceipt',
                'DeliveryLeadTime',
                'LeadTimeSupply',
                'TotalLeadTime',
                'status'
            ],
            offset: req.query.page ? (+req.query.page - 1) * +req.query.limit : 0,
            limit: req.query.limit ? +req.query.limit : 9999,
            where: {
                [Op.or]: [
                    {
                        VendorName: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    },
                    {
                        PartNumber: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    },
                    {
                        Description: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    },
                ]
            }
        });

        const data = paginattionGenerator(req, query);

        res.status(200).send(responseSuccess('Success', data));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const detail = async (req, res) => {
    try {
        const data = await pivotModel.findOne({
            attributes: [
                'id',
                'category',
                'name',
                'code',
                'status'
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
        await pivotModel.update({
            category: req.body.category,
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

const destroy = async (req, res) => {
    try {
        await pivotModel.destroy({ where: { id: req.params.id } });

        res.status(201).send(responseSuccess('Data deleted successfully'));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const listDropdown = async (req, res) => {
    try {
        const data = await pivotModel.findAll({
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

const dashboard = async (req, res) => {
    try {
        const query = await pivotModel.findAndCountAll({
            attributes: [
                [db.Sequelize.literal('DISTINCT VendorName'), 'VendorName'],
            ]
        });

        const date = await pivotModel.findAll({
            attributes: [
                [db.sequelize.fn('YEAR', db.sequelize.col('PODate')), 'Year'],
                [db.sequelize.fn('MONTH', db.sequelize.col('PODate')), 'Month'],
            ],
            group: [
                db.sequelize.fn('YEAR', db.sequelize.col('PODate')),
                db.sequelize.fn('MONTH', db.sequelize.col('PODate')),
            ],
        });

        const year = await pivotModel.findAll({
            attributes: [
                [db.sequelize.fn('YEAR', db.sequelize.col('PODate')), 'Year'],
            ],
            group: [
                db.sequelize.fn('YEAR', db.sequelize.col('PODate')),
            ],
        });

        const total = await pivotModel.findAndCountAll({
            attributes: [
                [db.Sequelize.fn('SUM', db.Sequelize.col('NetPrice')), 'TotalNetPrice']
            ],
            where: {
                [Op.or]: [
                    {
                        PartNumber: {
                            [Op.like]: ['%' + (req.query.part ?? '') + '%'],
                        },
                        Mnemonic: {
                            [Op.like]: ['%' + (req.query.mnemonic ?? '') + '%'],
                        },
                    }
                ]
            },
        });

        const vendorData = await pivotModel.findAll({
            attributes: [
                [db.Sequelize.literal('DISTINCT VendorName'), 'VendorName'],
                [db.Sequelize.fn('AVG', db.Sequelize.col('TotalLeadTime')), 'TotalLeadTime'],
                [db.Sequelize.fn('AVG', db.Sequelize.col('NetPrice')), 'NetPrice']
            ],
            where: {
                [Op.or]: [
                    {
                        PartNumber: {
                            [Op.like]: ['%' + (req.query.part ?? '') + '%'],
                        },
                        Mnemonic: {
                            [Op.like]: ['%' + (req.query.mnemonic ?? '') + '%'],
                        },
                    }
                ]
            },
            group: "VendorName",
            order: [
                [db.Sequelize.fn('AVG', db.Sequelize.col('NetPrice')), 'ASC'],
                [db.Sequelize.fn('AVG', db.Sequelize.col('TotalLeadTime')), 'ASC']
            ]
        });


        const result = paginattionGenerator(req, {
            count: query.count,
            vendorData: query,
            netPrice: total,
            vendorSummary: vendorData,
            year: year,
            date: date
        });

        res.status(200).send(responseSuccess('Success', result));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const monthYear = async (req, res) => {
    try {
        const date = await pivotModel.findAll({
            attributes: [
                [db.sequelize.fn('YEAR', db.sequelize.col('PODate')), 'Year'],
                [db.sequelize.fn('MONTH', db.sequelize.col('PODate')), 'Month'],
            ],
            where: db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('PODate')), req.query.year),
            group: [
                db.sequelize.fn('YEAR', db.sequelize.col('PODate')),
                db.sequelize.fn('MONTH', db.sequelize.col('PODate')),
            ],
        });

        const year = await pivotModel.findAll({
            attributes: [
                [db.sequelize.fn('YEAR', db.sequelize.col('PODate')), 'Year'],
            ],
            group: [
                db.sequelize.fn('YEAR', db.sequelize.col('PODate')),
            ],
        });

        const result = paginattionGenerator(req, {
            year: year,
            date: date
        });

        res.status(200).send(responseSuccess('Success', result));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const chart = async (req, res) => {
    try {
        const line = await pivotModel.findAll({
            attributes: [
                'POQty',
                'VendorName',
                'PartNumber',
                'NetPrice',
                [db.sequelize.fn('YEAR', db.sequelize.col('PODate')), 'Year'],
                [db.sequelize.fn('MONTH', db.sequelize.col('PODate')), 'Month'],
            ],
            where: {
                [Op.and]: [
                    db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('PODate')), req.query.year),
                    db.sequelize.where(db.sequelize.fn('MONTH', db.sequelize.col('PODate')), req.query.month),
                ],
            },
            order: [['POQty', 'DESC']], // Order by POQty in descending order
            limit: 10, // Limit to the top 10 rows
        });

        const transformedData = [];
        let count = 1;
        line.forEach(item => {
            const existingData = transformedData.find(data => data.id === item.VendorName);

            if (existingData) {
                count += 1
                existingData.data.push({ y: (item.POQty), x: count, data: item.PartNumber });
            } else {
                transformedData.push({
                    id: item.VendorName,
                    color: getRandomColor(),
                    data: [{ y: (item.POQty), x: count, data: item.PartNumber }],
                });
            }
        });

        function getRandomColor() {
            const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            return randomColor;
        }

        const result = paginattionGenerator(req, {
            line: transformedData,
        });

        result.line.forEach(vendorData => {
            console.log(vendorData)
            const xValues = vendorData.data.map(dataPoint => dataPoint.x);
            const maxIndex = Math.max(...xValues) - 1; // Subtract 1 to match 0-based indices
            for (let i = 1; i <= 10; i++) {
                if (!xValues.includes(i)) {
                    const emptyDataPoint = { y: 0, x: i, data: '' };
                    vendorData.data.splice(i - 1, 0, emptyDataPoint);
                }
            }
        });
        
        res.status(200).send(responseSuccess('Success', result));
    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const listMneumonic = async (req, res) => {
    try {
        const query = await pivotModel.findAndCountAll({
            attributes: [
                [db.Sequelize.literal('DISTINCT Mnemonic'), 'Mnemonic'],
            ],
            where: {
                [Op.or]: [
                    {
                        PartNumber: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    },
                    {
                        VendorName: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    },
                ]
            },
            order: [['Mnemonic', 'ASC']],
        });


        const data = paginattionGenerator(req, query);

        res.status(200).send(responseSuccess('Success', data));

    } catch (error) {
        res.status(500).send(responseError(error))
    }
}

const listPartNum = async (req, res) => {
    try {
        const query = await pivotModel.findAndCountAll({
            attributes: [
                [db.Sequelize.literal('DISTINCT PartNumber'), 'PartNumber'],
            ],
            limit: 10,
            where: {
                [Op.or]: [
                    {
                        PartNumber: {
                            [Op.like]: ['%' + (req.query.name ?? '') + '%'],
                        },
                    }
                ]
            },
            order: [['PartNumber', 'ASC']],
        });


        const data = paginattionGenerator(req, query);

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
    listMneumonic,
    listPartNum,
    monthYear,
    chart,
    dashboard
}