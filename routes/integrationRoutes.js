"use strict"

const integrationHotelController = require('../controllers/integration/hotelController');
const integrationMasterController = require('../controllers/integration/masterController');
const integrationReservationController = require('../controllers/integration/reservationController');
const auth = require('../middlewares/auth');

const router = require('express').Router();
const extractFile = require('../middlewares/check-img-mime-type');
const middleErrMsg = require('../config/errorMsg');
const { masterChargeTypes } = require('../config/sequelize');

router.post('/search', auth, extractFile, integrationHotelController.searchHotels, middleErrMsg);
router.post('/recheck', auth, extractFile, integrationHotelController.recheckHotels, middleErrMsg);
router.post('/booking', auth, extractFile, integrationHotelController.bookingHotels, middleErrMsg);

router.post('/list-hotel', auth, extractFile, integrationMasterController.listHotels, middleErrMsg);
router.post('/sync-hotel', auth, integrationMasterController.syncHotel);

module.exports = router;