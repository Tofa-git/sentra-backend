"use strict"

module.exports = (sequelize, DataTypes) => {
    let mappingHotel = sequelize.define('mapping_hotel', {
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
        },
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'mapping_country',
                key: 'id',
            }
        },
        cityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'mapping_city',
                key: 'id',
            }
        },
        cityCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cityName: {
            type: DataTypes.STRING,
            allowNull: false,
        },  
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },  
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },   
        star: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(9, 6), // Total digits and decimal places
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(9, 6), // Total digits and decimal places
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zipCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        chainCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        chainName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        brandCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        brandName: {
            type: DataTypes.STRING,
            allowNull: true,
        },  
        type: {
            type: DataTypes.STRING,
            allowNull: true,
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

    mappingHotel.associate = (models) => {
        mappingHotel.belongsTo(models.supplier, { foreignKey: 'supplierId' });        
        mappingHotel.belongsTo(models.mappingCountry, { foreignKey: 'countryId' });
        mappingHotel.belongsTo(models.mappingCity, { foreignKey: 'cityId' });
    };

    return mappingHotel;
}