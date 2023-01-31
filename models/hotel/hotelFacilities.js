"use strict"

module.exports = (sequelize, DataTypes) => {
    let hotelFacility = sequelize.define('hotel_facilities', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        hotelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },        
        hotelFacilityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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

    return hotelFacility;

}