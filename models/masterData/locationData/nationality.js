"use strict"

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('nationality', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(64),
        },
        code: {
            type: DataTypes.STRING,
        },
        rank: {
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