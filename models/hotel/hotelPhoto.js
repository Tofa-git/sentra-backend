"use strict"

module.exports = (sequelize, DataTypes) => {
    let model = sequelize.define('hotel_photos', {
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
        fileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },
        isMain: {
            type: DataTypes.BOOLEAN,
            default: 0,
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

    return model;

}