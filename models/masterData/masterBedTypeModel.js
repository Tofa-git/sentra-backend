"use strict"

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('ms_bedtype', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        supplierId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'supplier',
                key: 'id',
            }
        },
        occupancy: {
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
        },
        code: {
            type: DataTypes.STRING,
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

    model.associate = (models) => {
        model.belongsTo(models.supplier, { foreignKey: 'supplierId' });
    };

    return model;

}