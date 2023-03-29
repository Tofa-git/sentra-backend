"use strict"

module.exports = (sequelize, DataTypes) => {
    let cityCode = sequelize.define('city_code', {
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
        sequence: {
            type: DataTypes.INTEGER,
            require: true
        },
        code: {
            type: DataTypes.STRING(7),
            require: true
        },   
        long_name: {
            type: DataTypes.STRING(255),
            require: true
        },       
        short_name: {
            type: DataTypes.STRING(150),
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

    return cityCode;

}