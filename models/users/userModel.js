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
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
            require: false
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isFirstLogin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        status: {
            type: DataTypes.STRING,
            enum: ['0', '1', '2', '3'],
            default: '0',
        },
        otp: {
            type: DataTypes.STRING,
            required: true,
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

    return user;
}