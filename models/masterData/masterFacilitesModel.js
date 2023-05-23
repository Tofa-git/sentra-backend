"use strict"

module.exports = (sequelize, DataTypes) => {
    const masterFacility = sequelize.define('ms_facilities', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: DataTypes.STRING,
            require: true
        },
        description: {
            type: DataTypes.STRING,
            require: true
        },
        category: {
            type: DataTypes.STRING,
            enum: ['hotel', 'room'],
        },
        used: {
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

    return masterFacility;

}