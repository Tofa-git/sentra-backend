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
        day: {
            type: DataTypes.INTEGER,
            require: true
        },
        time: {
            type: DataTypes.TIME,
            require: true
        },
        type: {
            type: DataTypes.INTEGER,
            require: true
        },
        night: {
            type: DataTypes.DOUBLE,
            require: true
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