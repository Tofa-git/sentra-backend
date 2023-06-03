"use strict"

module.exports = (sequelize, DataTypes) => {
    let masterHotel = sequelize.define('ms_hotels', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cityCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        locationCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(64),
        },
        checkInTime: {
            type: DataTypes.STRING,
        },
        checkOutTime: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING(64),
        },
        phone: {
            type: DataTypes.STRING(32),
        },
        website: {
            type: DataTypes.STRING(128),
            allowNull: true,
        },
        youtube: {
            type: DataTypes.STRING(128),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
        },
        zipCode: {
            type: DataTypes.STRING(8),
        },
        latitude: {
            type: DataTypes.FLOAT,
        },
        longitude: {
            type: DataTypes.FLOAT,
        },
        star: {
            type: DataTypes.STRING,
        },
        totalRoom: {
            type: DataTypes.INTEGER,
        },
        internalRemark: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.STRING,
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