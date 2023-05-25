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
        name: {
            type: DataTypes.STRING,
            require: true
        },
        category: {
            type: DataTypes.STRING,
            enum: ['hotel', 'room'],
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

    return masterFacility;

}