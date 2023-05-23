"use strict"

module.exports = (sequelize, DataTypes) => {
    let masterSession = sequelize.define('ms_sessions', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.STRING,
            require: true
        },
        code: {
            type: DataTypes.STRING,
            require: true,
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

    return masterSession;

}