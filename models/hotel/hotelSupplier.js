"use strict"

module.exports = (sequelize, DataTypes) => {
    let hotelSupplier = sequelize.define('hotel_suppliers', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        supplierId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },
        hotelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },
        cxlPolicyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },
        hotelSupplierCode: {
            type: DataTypes.STRING(16),
            allowNull: true,
            require: false
        },
        prepayment: {
            type: DataTypes.STRING,
            enum: ['0', '1'],
            default: '0',
        },
        nonXml: {
            type: DataTypes.STRING,
            enum: ['0', '1'],
            default: '0',
        },
        nonTarif: {
            type: DataTypes.STRING,
            enum: ['0', '1'],
            default: '0',
        },
        status: {
            type: DataTypes.STRING,
            enum: ['0', '1', '2', '3'],
            default: '0',
        },
        createdBy: {
            type: DataTypes.INTEGER, 
            allowNull: false,           
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        freezeTableName: true
    })

    return hotelSupplier;

}