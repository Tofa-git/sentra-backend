"use strict"

module.exports = (sequelize, DataTypes) => {
    let model = sequelize.define('hotel_photos', {
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
        url: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
            default: 'photo',
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