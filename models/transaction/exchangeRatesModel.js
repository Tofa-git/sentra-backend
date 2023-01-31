"use strict"

module.exports = (sequelize, DataTypes) => {
    let exchangeRate = sequelize.define('exchange_rates', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            require: true
        },
        sourceCurr: {
            type: DataTypes.BIGINT,
            require: true
        },
        targetCurr: {
            type: DataTypes.BIGINT,
            require: true
        },
        value: {
            type: DataTypes.DOUBLE(8, 4),
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

    return exchangeRate;

}