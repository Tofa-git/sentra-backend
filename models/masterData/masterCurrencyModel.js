"use strict"

module.exports = (sequelize, DataTypes) => {
    let masterCurrency = sequelize.define('ms_currencys', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        symbol: {
            type: DataTypes.INTEGER(4),
            require: true
        },
        name: {
            type: DataTypes.STRING(8),
            require: true,                        
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

    return masterCurrency;

}