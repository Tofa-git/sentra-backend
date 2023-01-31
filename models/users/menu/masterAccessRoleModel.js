"use strict"

module.exports = (sequelize, DataTypes) => {
    let msAccessRole = sequelize.define('user_access_role', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },
        menuId: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true
        },     
        canRead: {
            type: DataTypes.STRING,
            enum: ['0', '1'],
            default: '0',
        },  
        canEdit: {
            type: DataTypes.STRING,
            enum: ['0', '1'],
            default: '0',
        },  
        canDelete: {
            type: DataTypes.STRING,
            enum: ['0', '1'],
            default: '0',
        },  
        canImport: {
            type: DataTypes.STRING,
            enum: ['0', '1'],
            default: '0',
        },  
        canExport: {
            type: DataTypes.STRING,
            enum: ['0', '1'],
            default: '0',
        },  
        canApprove: {
            type: DataTypes.STRING,
            enum: ['0', '1'],
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

    return msAccessRole;

}