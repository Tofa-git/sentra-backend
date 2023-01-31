"use strict"

module.exports = (sequelize, DataTypes) => {
    let hotelExtra = sequelize.define('hotel_extras', {
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
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true
        },      
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            require: false
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

    return hotelExtra;

}