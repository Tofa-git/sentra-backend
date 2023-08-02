"use strict"

module.exports = (sequelize, DataTypes) => {
    let supplierEmergency = sequelize.define('supplier_emergency', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },        
        cityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'city_code',
                key: 'id',
            }
        },
        supplierManId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'supplier_manager',
                key: 'id',
            }
        },
        phoneFirst: {
            type: DataTypes.BIGINT,
            unique: true,
            allowNull: false,
            validate: {
                not: {
                    args: ["[a-z]", 'i'],
                    msg: "Please enter a valid number"
                },
                len: {
                    args: [5, 25],
                    msg: "Min length of the phone number is 5"
                },
            },
        },
        phoneSecond: {
            type: DataTypes.BIGINT,
            unique: true,
            allowNull: false,
            validate: {
                not: {
                    args: ["[a-z]", 'i'],
                    msg: "Please enter a valid number"
                },
                len: {
                    args: [5, 25],
                    msg: "Min length of the phone number is 5"
                },
            },
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

    supplierEmergency.associate = (models) => {
        supplierEmergency.belongsTo(models.cityCode, { foreignKey: 'cityId' });
        supplierEmergency.belongsTo(models.supplierManager, { foreignKey: 'supplierManId' });
    };

    return supplierEmergency;
}