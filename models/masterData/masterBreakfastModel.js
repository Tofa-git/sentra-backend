"use strict"

module.exports = (sequelize, DataTypes) => {
    let masterBreakfast = sequelize.define('ms_breakfasts', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        sequence: {
            type: DataTypes.INTEGER,
            require: true
        },
        description: {
            type: DataTypes.STRING,
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

    return masterBreakfast;

}