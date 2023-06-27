"use strict"

module.exports = (sequelize, DataTypes) => {
    const masterBreakfast = sequelize.define('bookings', {
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
        agencyBookingID: {
            type: DataTypes.STRING,
        },
        mgBookingVersionID: {
            type: DataTypes.STRING,
        },
        agencyVoucherNo: {
            type: DataTypes.STRING,
        },
        agencyVoucherDate: {
            type: DataTypes.STRING,
        },
        hotelCode: {
            type: DataTypes.STRING,
        },
        hotelName: {
            type: DataTypes.STRING,
        },
        roomCode: {
            type: DataTypes.STRING,
        },
        roomName: {
            type: DataTypes.STRING,
        },
        checkIn: {
            type: DataTypes.STRING,
        },
        checkOut: {
            type: DataTypes.STRING,
        },
        mealPlan: {
            type: DataTypes.STRING,
        },
        cancellationPolicyType: {
            type: DataTypes.STRING,
        },
        netPrice: {
            type: DataTypes.FLOAT,
        },
        grossPrice: {
            type: DataTypes.FLOAT,
        },
        chargeNetPrice: {
            type: DataTypes.FLOAT,
        },
        chargeGrossPrice: {
            type: DataTypes.FLOAT,
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

    return masterBreakfast;

}