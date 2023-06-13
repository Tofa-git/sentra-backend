"use strict"

module.exports = (sequelize, DataTypes) => {
    let cityLocation = sequelize.define('city_location', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        cityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(64),
        },
        code: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        },
        latitude: {
            type: DataTypes.FLOAT,            
        },
        longitude: {
            type: DataTypes.FLOAT,            
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