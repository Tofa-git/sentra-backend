"use strict"

module.exports = (sequelize, DataTypes) => {
    const masterBreakfast = sequelize.define('ms_breakfasts', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
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

    return masterBreakfast;

}