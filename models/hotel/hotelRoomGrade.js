"use strict"

module.exports = (sequelize, DataTypes) => {
    let hotelRoomGrade = sequelize.define('hotel_room_grades', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        hotelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },        
        roomGradeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
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

    return hotelRoomGrade;

}