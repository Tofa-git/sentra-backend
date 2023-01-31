"use strict"

module.exports = (sequelize, DataTypes) => {
    let cxlPolicyDetail = sequelize.define('cxl_policy_details', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        cxlPolicyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },
        description: {
            type: DataTypes.STRING,
            require: true
        },
        cutOffDay: {
            type: DataTypes.INTEGER,
            require: true
        },
        time: {
            type: DataTypes.TIME,
            require: true
        },
        chargeType: {
            type: DataTypes.INTEGER,
            require: true
        },
        value: {
            type: DataTypes.DOUBLE,
            require: true
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

    return cxlPolicyDetail;

}