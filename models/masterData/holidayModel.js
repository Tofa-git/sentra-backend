"use strict"

module.exports = (sequelize, DataTypes) => {
    const masterBreakfast = sequelize.define('holidays', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATEONLY,
        },
        isHoliday: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        freezeTableName: true
    })

    return masterBreakfast;

}