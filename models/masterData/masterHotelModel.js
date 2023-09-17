"use strict"

module.exports = (sequelize, DataTypes) => {
    let masterHotel = sequelize.define('ms_hotels', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
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
        continent: {
            type: DataTypes.STRING(25),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
        },
        zipCode: {
            type: DataTypes.STRING(8),
        },
        latitude: {
            type: DataTypes.DECIMAL(9, 6), // Total digits and decimal places
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(9, 6), // Total digits and decimal places
            allowNull: true
        },
        continent: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        code: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(64),
        },    
        checkInTime: {
            type: DataTypes.STRING,
        },
        checkOutTime: {
            type: DataTypes.STRING,
        },
        shortDescription: {
            type: DataTypes.TEXT,
        },
        longDescription: {
            type: DataTypes.TEXT,
        },
        extra: {
            type: DataTypes.TEXT,
        },
        email: {
            type: DataTypes.STRING(255),
        },
        phone: {
            type: DataTypes.STRING(32),
        },
        website: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        youtube: {
            type: DataTypes.STRING(128),
            allowNull: true,
        },       
        star: {
            type: DataTypes.STRING,
        },
        totalRoom: {
            type: DataTypes.INTEGER,
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
            allowNull: false,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        freezeTableName: true
    })

    masterHotel.associate = (models) => {        
        masterHotel.belongsTo(models.mappingCountry, { foreignKey: 'countryId' });
        masterHotel.belongsTo(models.mappingCity, { foreignKey: 'cityId' });
    };

    return masterHotel;

}