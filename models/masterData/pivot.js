"use strict"

module.exports = (sequelize, DataTypes) => {
    const MaterialData = sequelize.define('aging', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        Material: {
            type: DataTypes.STRING,
            allowNull: true
        },
        PartNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Mnemonic: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        NetPrice: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: true
        },
        Plant: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Pgr: {
            type: DataTypes.STRING,
            allowNull: true
        },
        PRNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        PRType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        PRDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        PRQty: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        PRFullApproveLeadTime: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Uom: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Vendor: {
            type: DataTypes.STRING,
            allowNull: true
        },
        VendorName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        PONumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        POType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        PODate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        DeliveryDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        POQty: {
            type: DataTypes.STRING,
            allowNull: true
        },
        PRToPOLeadTime: {
            type: DataTypes.INTEGER,
            allowNull: true
        },    
        POFullApproveLeadTime: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        GRNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        GRDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        QtyReceipt: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        DeliveryLeadTime: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        LeadTimeSupply: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        TotalLeadTime: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            enum: ['0', '1', '2', '3'],
            default: '1',
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
    });

    return MaterialData;

}