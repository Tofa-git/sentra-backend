"use strict"

const dbConfig = require('./dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

const db = {}


const sequelize = new Sequelize(
    dbConfig.db,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        operatorsAliases: 0,
        port:dbConfig.port,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)
// console.log(dbConfig.user);
sequelize.authenticate()
    .then(() => {
        console.log('connected..')
    })
    .catch(err => {
        console.log('Error' + err)
    })


db.Sequelize = Sequelize
db.sequelize = sequelize

// CXL
db.cxlPolicy = require('../models/cxl/cxlPolicy')(sequelize, DataTypes);
db.cxlPolicyDetail = require('../models/cxl/cxlPolicyDetail')(sequelize, DataTypes);

// User
db.users = require('../models/users/userModel')(sequelize, DataTypes);
db.roles= require('../models/users/userRoleModel')(sequelize, DataTypes);
db.masterMenu = require('../models/users/menu/masterMenuModel')(sequelize, DataTypes);
db.accessRole = require('../models/users/menu/masterAccessRoleModel')(sequelize, DataTypes);

// Master Data
db.masterBreakfasts = require('../models/masterData/masterBreakfastModel')(sequelize, DataTypes);
db.masterChargeTypes = require('../models/masterData/masterChargeTypeModel')(sequelize, DataTypes);
db.masterCurrency = require('../models/masterData/masterCurrencyModel')(sequelize, DataTypes);
db.masterFacility = require('../models/masterData/masterFacilitesModel')(sequelize, DataTypes);
db.masterHotel = require('../models/masterData/masterHotelModel')(sequelize, DataTypes);
db.masterPaymentMethod = require('../models/masterData/masterPaymentMethodModel')(sequelize, DataTypes);
db.masterRoomGrade = require('../models/masterData/masterRoomGradeModel')(sequelize,DataTypes);
db.masterSession  = require('../models/masterData/masterSessionModel')(sequelize,DataTypes);
db.holiday = require('../models/masterData/holidayModel')(sequelize,DataTypes);
db.file = require('../models/masterData/fileModel')(sequelize,DataTypes);

//#region Master Data Location
db.nationality = require('../models/masterData/locationData/nationality')(sequelize,DataTypes);
db.cityCode = require('../models/masterData/locationData/cityCode')(sequelize,DataTypes);
db.cityLocation = require('../models/masterData/locationData/cityLocation')(sequelize,DataTypes);
db.countryCode = require('../models/masterData/locationData/countryCode')(sequelize,DataTypes);
db.countryGroup = require('../models/masterData/locationData/countryGroup')(sequelize,DataTypes);

//#endregion

// Hotel
db.hotelExtra = require('../models/hotel/hotelExtra')(sequelize, DataTypes);
db.hotelFacility = require('../models/hotel/hotelFacilities')(sequelize, DataTypes);
db.hotelRoomGrade = require('../models/hotel/hotelRoomGrade')(sequelize, DataTypes);
db.hotelSupplier = require('../models/hotel/hotelSupplier')(sequelize, DataTypes);
db.hotelPhoto = require('../models/hotel/hotelPhoto')(sequelize, DataTypes);

// Log
db.logActivity = require('../models/log/logActivitiesModel')(sequelize, DataTypes);

// Transaction
db.exchangeRate  = require('../models/transaction/exchangeRatesModel')(sequelize,DataTypes);
db.booking = require('../models/transaction/bookingModel')(sequelize,DataTypes);
db.bookingGuest = require('../models/transaction/bookingGuestModel')(sequelize,DataTypes);

// Testing
db.products = require('../models/producteModel')(sequelize, DataTypes);
// db.reviews = require('./reviewModel.js')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync done!')
    })

module.exports = db;