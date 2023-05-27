"use strict"

module.exports = (sequelize, DataTypes) => {
    const masterBreakfast = sequelize.define('cxl_policies', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
        },
        code: {
            type: DataTypes.STRING,
        },
        day_1: {
            type: DataTypes.INTEGER,
        },
        time_1: {
            type: DataTypes.TIME,
        },
        type_1: {
            type: DataTypes.STRING,
        },
        night_1: {
            type: DataTypes.INTEGER,
        },
        day_2: {
            type: DataTypes.INTEGER,
        },
        time_2: {
            type: DataTypes.TIME,
        },
        type_2: {
            type: DataTypes.STRING,
        },
        night_2: {
            type: DataTypes.INTEGER,
        },
        day_3: {
            type: DataTypes.INTEGER,
        },
        time_3: {
            type: DataTypes.TIME,
        },
        type_3: {
            type: DataTypes.STRING,
        },
        night_3: {
            type: DataTypes.INTEGER,
        },
        day_4: {
            type: DataTypes.INTEGER,
        },
        time_4: {
            type: DataTypes.TIME,
        },
        type_4: {
            type: DataTypes.STRING,
        },
        night_4: {
            type: DataTypes.INTEGER,
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