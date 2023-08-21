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
            references: {
                model: 'ms_hotels',
                key: 'id',
            }
        },
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'country_code',
                key: 'id',
            }
        },
        cityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'city_code',
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
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },   
        star: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zipCode: {
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

    mappingHotel.associate = (models) => {
        mappingHotel.belongsTo(models.supplier, { foreignKey: 'supplierId' });
        mappingHotel.belongsTo(models.msHotels, { foreignKey: 'masterId' });
        mappingHotel.belongsTo(models.countryCode, { foreignKey: 'countryId' });
        mappingHotel.belongsTo(models.cityCode, { foreignKey: 'cityId' });
    };

    return mappingHotel;
}