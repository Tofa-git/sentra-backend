"use strict"

module.exports = (sequelize, DataTypes) => {
    let masterHotel= sequelize.define('ms_hotels', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        countryId: {
            type: DataTypes.INTEGER, 
            allowNull: false,           
        },
        cityId: {
            type: DataTypes.INTEGER, 
            allowNull: false,           
        },
        locationId: {
            type: DataTypes.INTEGER, 
            allowNull: false,           
        },
        code: {
            type: DataTypes.STRING(10), 
            allowNull: false,           
        },
        sequence: {
            type: DataTypes.INTEGER,
            require: true
        },
        name: {
            type: DataTypes.STRING(64),
            require: true
        },
        email: {
            type: DataTypes.STRING(64),
            require: true
        },
        bqEmail: {
            type: DataTypes.STRING(64),
            require: false,
            allowNull: true,
        },
        ccEmail: {
            type: DataTypes.STRING(64),
            require: false,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(32),
            require: true
        },
        fax: {
            type: DataTypes.STRING(32),
            require: false,
            allowNull: true,
        },
        website: {
            type: DataTypes.STRING(128),
            require: false,
            allowNull: true,
        },
        youtube: {
            type: DataTypes.STRING(128),
            require: false,
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            require: true
        },
        zipCode: {
            type: DataTypes.STRING(8),
            require: true
        },
        latitude: {
            type: DataTypes.FLOAT,
            require: true
        },
        longitude: {
            type: DataTypes.FLOAT,
            require: true
        },
        starType: {
            type: DataTypes.BIGINT,
            require: true
        },
        totalRoom: {
            type: DataTypes.INTEGER,
            require: true
        },
        event: {
            type: DataTypes.TEXT,
            require: true
        },
        manager: {
            type: DataTypes.STRING(64),
            require: true
        },
        internalRemark: {
            type: DataTypes.TEXT,
            require: true
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

    return masterHotel;

}