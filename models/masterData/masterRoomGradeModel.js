"use strict"

module.exports = (sequelize, DataTypes) => {
    let masterRoomGrade = sequelize.define('ms_room_grades', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            require: true
        },
        code: {
            type: DataTypes.STRING,
            require: true,
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

    return masterRoomGrade;

}