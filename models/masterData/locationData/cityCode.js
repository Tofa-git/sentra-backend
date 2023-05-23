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
        },
        sequence: {
            type: DataTypes.INTEGER,
        },
        code: {
            type: DataTypes.STRING(7),
        },   
        long_name: {
            type: DataTypes.STRING(255),
        },       
        short_name: {
            type: DataTypes.STRING(150),
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

    return cityCode;

}