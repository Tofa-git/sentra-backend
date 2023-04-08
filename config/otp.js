"use strict"

require('dotenv').config();

module.exports = {
    min: process.env.OTP_MIN,  
    lca: process.env.OTP_LCA,
    uca: process.env.OTP_UCA,
    special: process.env.OTP_SPECIALCHAR,  
    OTP_LENGTH: 6,
    OTP_CONFIG: {
      upperCaseAlphabets: true,
      specialChars: false,
    },  
}