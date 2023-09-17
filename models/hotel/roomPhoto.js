"use strict"

module.exports = (sequelize, DataTypes) => {
    let model = sequelize.define('room_photos', {
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
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'hotel_rooms',
                key: 'id',
            }
        },
        url: {
            type: DataTypes.STRING,
        },      
        type: {
            type: DataTypes.STRING,
            default: 'photo',
        },
        isMain: {
            type: DataTypes.BOOLEAN,
            default: false,
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
        model.belongsTo(models.hotelRoom, { foreignKey: 'roomId' });
    };
    return model;

}