"use strict"

const integrationHotelController = require('../controllers/integration/hotelController');
const integrationMasterController = require('../controllers/integration/masterController');
const integrationMappingController = require('../controllers/integration/mappingController');
const integrationReservationController = require('../controllers/integration/reservationController');
const auth = require('../middlewares/auth');

const router = require('express').Router();
const extractFile = require('../middlewares/check-img-mime-type');
const middleErrMsg = require('../config/errorMsg');
const { masterChargeTypes } = require('../config/sequelize');

router.post('/search-hotel', auth, integrationHotelController.searchHotels);
router.post('/recheck', auth, integrationHotelController.recheckHotels);
router.post('/booking', auth, integrationHotelController.bookingHotels);
router.get('/booking-list', auth, integrationHotelController.bookingList);
router.get('/booking-detail/:id', auth, integrationHotelController.bookingDetail);
router.put('/booking-cancel/:id', auth, integrationHotelController.bookingCancel);

router.post('/list-hotel', auth, extractFile, integrationMasterController.listHotels, middleErrMsg);
router.post('/sync-hotel', auth, integrationMasterController.syncHotel);

/* Mapping Country */
router.get('/sync-mapcountry/:id', auth, integrationMappingController.syncMappingCountry);
router.post('/show-mapcountry', auth, integrationMappingController.showMappingCountry);
router.post('/create-mapcountry', auth, integrationMappingController.createCountry);
router.put('/update-mapcountry/:id', auth, integrationMappingController.updateCountry);
router.get('/sync-mapcity/:id', auth, integrationMappingController.syncMappingCity);
router.get('/sync-maphotel', auth, integrationMasterController.syncHotel);

module.exports = router;