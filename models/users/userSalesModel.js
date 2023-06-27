"use strict"
const secrets = [
    "password",
    "status",
    "createdAt",
    "updatedAt",
];

module.exports = (sequelize, DataTypes) => {
    let userSales = sequelize.define('user_sales', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        manager: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobile: {
            type: DataTypes.BIGINT,
            unique: true,
            allowNull: false,
            validate: {
                not: {
                    args: ["[a-z]", 'i'],
                    msg: "Please enter a valid number"
                },
                len: {
                    args: [10, 20],
                    msg: "Min length of the phone number is 10"
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },       
        status: {
            type: DataTypes.STRING,
            enum: ['0', '1', '2', '3'],
            default: '0',
        },      
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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

    return userSales;
}