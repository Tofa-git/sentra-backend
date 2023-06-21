"use strict"

module.exports = (sequelize, DataTypes) => {
    const masterBreakfast = sequelize.define('booking_guests', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        mgBookingID: {
            type: DataTypes.STRING,
        },
        salutation: {
            type: DataTypes.STRING,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        age: {
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

    return masterBreakfast;

}