"use strict"

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('ms_files', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        url: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
            default: 'photo',
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

    return model;

}