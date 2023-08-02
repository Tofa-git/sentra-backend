"use strict"

module.exports = (sequelize, DataTypes) => {
    let mappingCountry = sequelize.define('mapping_country', {
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
        masterId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'country_code',
                key: 'id',
            }
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
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
        classMethods: {

        }
    })

    mappingCountry.associate = (models) => {
        mappingCountry.belongsTo(models.supplier, { foreignKey: 'supplierId' });
        mappingCountry.belongsTo(models.countryCode, { foreignKey: 'masterId' });
    };

    return mappingCountry;
}