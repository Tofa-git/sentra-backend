"use strict"

module.exports = (sequelize, DataTypes) => {
    let logActivity = sequelize.define('log_activities', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        ip4: {
            type: DataTypes.STRING(16),
            require: true
        },
        module: {
            type: DataTypes.STRING(64),
            require: true
        },
        title: {
            type: DataTypes.STRING(64),
            require: true
        },
        description: {
            type: DataTypes.TEXT,
            require: false
        },
        url: {
            type: DataTypes.TEXT,
            require: true
        },
        method: {
            type: DataTypes.STRING(12),
            require: true
        },
        device: {
            type: DataTypes.STRING(32),
            require: false
        },
        platform: {
            type: DataTypes.STRING(32),
            require: false
        },
        agent: {
            type: DataTypes.STRING,
            require: false
        },
        browser: {
            type: DataTypes.STRING(32),
            require: false
        },
        browserVersion: {
            type: DataTypes.STRING(32),
            require: false
        },
        latitude: {
            type: DataTypes.FLOAT,
            require: true
        },
        longitude: {
            type: DataTypes.FLOAT,
            require: true
        },
        log_type: {
            type: DataTypes.STRING,
            enum: ['0', '1', '2', '3'],
            default: '0',
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

    return logActivity;

}