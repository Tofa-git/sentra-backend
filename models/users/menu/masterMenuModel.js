"use strict"

module.exports = (sequelize, DataTypes) => {
    let msMenu = sequelize.define('user_menu', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,            
        },
        menuName: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },
        menuIcon: {
            type: DataTypes.STRING,
            allowNull: true,
            require: false
        },     
        menuIcon2: {
            type: DataTypes.STRING,
            allowNull: true,
            require: false
        },    
        menuAction: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true
        },  
        isMenu: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 1,
        },   
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true
        },    
        parentMenuId: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true
        },  
        sequence: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default:0,
        },  
        displaySequence: {
            type: DataTypes.INTEGER,
            allowNull: true,
            default:null,
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

    return msMenu;

}