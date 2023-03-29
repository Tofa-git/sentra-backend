"use strict"

module.exports = (sequelize, DataTypes) => {
    let cityLocation = sequelize.define('country_code', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        isoId: {
            type: DataTypes.STRING(3),
            allowNull: false,
            require: true,
            unique: true,
        },
        iso3: {
            type: DataTypes.STRING(3),
            allowNull: false,
            require: true
        },      
        name: {
            type: DataTypes.STRING(64),
            require: true
        },
        dial: {
            type: DataTypes.STRING(5),
            require: true
        },
        basicCurrency: {
            type: DataTypes.STRING(3),
            require: true
        },
        descCurrency: {
            type: DataTypes.STRING(64),
            require: true
        },   
        sequence: {
            type: DataTypes.INTEGER,
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