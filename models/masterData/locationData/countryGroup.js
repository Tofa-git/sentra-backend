"use strict"

module.exports = (sequelize, DataTypes) => {
    let cityLocation = sequelize.define('country_group', {
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
            require: true
        },
        name: {
            type: DataTypes.STRING(64),
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

    return cityLocation;

}