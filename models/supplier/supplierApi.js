"use strict"

module.exports = (sequelize, DataTypes) => {
    let supplierApi = sequelize.define('supplier_api', {
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },  
        endpoint: {
            type: DataTypes.STRING,
            allowNull: false,
        },  
        method: {
            type: DataTypes.STRING,
            allowNull: true,
        },  
        code: {
            type: DataTypes.STRING,
            allowNull: true,
        },       
        user: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            enum: ['0', '1', '2', '3'],
            default: '0',
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        freezeTableName: true,
        // timestamps: false,
        // createdAt: false,
        // updatedAt: false,
        classMethods: {

        }
    })

    supplierApi.associate = (models) => {
        supplierApi.belongsTo(models.supplier, { foreignKey: 'supplierId' });
    };

    return supplierApi;
}