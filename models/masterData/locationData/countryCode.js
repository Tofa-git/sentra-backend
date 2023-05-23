"use strict"

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('country_code', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        isoId: {
            type: DataTypes.STRING(3),
            unique: true,
        },
        iso3: {
            type: DataTypes.STRING(3),
        },
        name: {
            type: DataTypes.STRING(64),
        },
        dial: {
            type: DataTypes.STRING(5),
        },
        basicCurrency: {
            type: DataTypes.STRING(3),
        },
        descCurrency: {
            type: DataTypes.STRING(64),
        },
        sequence: {
            type: DataTypes.INTEGER,
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
        },
    }, {
        freezeTableName: true
    })

    return model;
}