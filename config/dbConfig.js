"use strict"

require('dotenv').config();

module.exports = {
    host: process.env.DB_HOST,
    db: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,        
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,        
        idle: 10000
    }
}