"use strict"

module.exports = (sequelize, DataTypes) => {
    let supplier = sequelize.define('supplier', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(2),
            enum: ['1', '2', '3'],
            default: '0',
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
        fax: {
            type: DataTypes.BIGINT,            
            allowNull: true,
            validate: {
                not: {
                    args: ["[a-z]", 'i'],
                    msg: "Please enter a valid number"
                },                
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        rqEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }, 
        ccEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },       
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },    
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        remark: {
            type: DataTypes.STRING,
            allowNull: false,
        },    
        creditDay: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        exchangeRate: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        agentMarkup: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        xmlMapping: {
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

    return supplier;
}