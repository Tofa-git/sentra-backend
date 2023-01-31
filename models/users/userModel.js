"use strict"
const secrets = [
    "password",    
    "status",
    "createdAt",
    "updatedAt",
  ];

module.exports = (sequelize, DataTypes) => {
    let user = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobile: {
            type: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
        // timestamps: false,
        // createdAt: false,
        // updatedAt: false,
        classMethods: {

        }
    })

    return user;
}