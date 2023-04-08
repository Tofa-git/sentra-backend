"use strict"

require('dotenv').config();

module.exports = {
    
    MAIL_SETTINGS: {
        service: "SMTP",
        port: process.env.MAIL_PORT,
        host: process.env.MAIL_HOST,
        secure: true,
        default: process.env.MAIL_TO_DEFAULT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
        tls:{
            rejectUnauthorized:false
        }
    },
}