"use strict"

module.exports = (sequelize, DataTypes) => {
    let product = sequelize.define('products', {
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
        description: {
            type: DataTypes.STRING,
            require: true
        },

        originalPrice: {
            type: DataTypes.INTEGER,
            require: true
        },

        discount: {
            type: DataTypes.INTEGER,
            require: true
        },

        category: {
            type: DataTypes.STRING,
            require: true
        },

        imagePath: {
            type: DataTypes.STRING,
            require: true,
        },

        status: {
            type: DataTypes.STRING,
            enum: ['0', '1', '2', '3'],
            default: '0',
        },
        // createdBy: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: "users",
        //         key: "id",
        //     },
        // },
        // updatedBy: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: "users",
        //         key: "id",
        //     },
        // },
    }, {
        freezeTableName: true
    })

    return product;

}