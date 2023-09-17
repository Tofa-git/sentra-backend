"use strict"

module.exports = (sequelize, DataTypes) => {
    let model = sequelize.define('hotel_rooms', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        hotelId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'ms_hotels',
                key: 'id',
            }
        },
        code: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,            
        },
        size: {
            type: DataTypes.STRING(20),            
        },
        maxOccupancy: {
            type: DataTypes.STRING(10),
        },
        maxAdult: {
            type: DataTypes.STRING(10),
        },
        isSmokingAllowed: {
            type: DataTypes.BOOLEAN,
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
        model.belongsTo(models.msHotels, { foreignKey: 'hotelId' });
    };
    return model;

}