"use strict"

module.exports = (sequelize, DataTypes) => {
    const bookingServices = sequelize.define('booking_services', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        bookingId: {
            type: DataTypes.STRING,
        },
        service: {
            type: DataTypes.STRING,
        },
        chargeSale: {
            type: DataTypes.FLOAT,
        },
        chargeNet: {
            type: DataTypes.FLOAT,
        },
        toHotel: {
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

    return bookingServices;

}