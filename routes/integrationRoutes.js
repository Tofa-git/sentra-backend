"use strict"

const integrationHotelController = require('../controllers/integration/hotelController');
const integrationMasterController = require('../controllers/integration/masterController');
const mappingCountryController = require('../controllers/mapping/countryController');
const mappingCityController = require('../controllers/mapping/cityController');
const mappingHotelController = require('../controllers/mapping/hotelController');
const integrationReservationController = require('../controllers/integration/reservationController');
const auth = require('../middlewares/auth');

const router = require('express').Router();
const extractFile = require('../middlewares/check-img-mime-type');
const middleErrMsg = require('../config/errorMsg');
const { masterChargeTypes } = require('../config/sequelize');

router.post('/search-hotel', auth, integrationHotelController.searchHotels);
router.post('/search-hotel-room/:supplierId', auth, integrationHotelController.roomDidaHotels);
router.post('/recheck', auth, integrationHotelController.recheckHotels);
router.post('/booking', auth, integrationHotelController.bookingHotels);
router.get('/booking-list', auth, integrationHotelController.bookingList);
router.post('/booking-detail/:id', auth, integrationHotelController.bookingDetail);
router.put('/booking-cancel/:id', auth, integrationHotelController.bookingCancel);

router.post('/list-hotel', auth, extractFile, integrationMasterController.listHotels, middleErrMsg);
router.post('/sync-hotel', auth, integrationMasterController.syncHotel);

/* Mapping Country */
router.get('/sync-mapcountry/:id', auth, mappingCountryController.syncMappingCountry);
router.post('/show-mapcountry', auth, mappingCountryController.showMappingCountry);
router.post('/create-mapcountry', auth, mappingCountryController.createCountry);
router.put('/update-mapcountry/:id', auth, mappingCountryController.updateCountry);
router.post('/mapcountry-dd', auth, mappingCountryController.listDropdown);

/* Mapping City */
router.get('/sync-mapcity/:id', auth, mappingCityController.syncMappingCity);
router.post('/show-mapcity', auth, mappingCityController.showMappingCity);
router.post('/create-mapcity', auth, mappingCityController.createCity);
router.put('/update-mapcity/:id', auth, mappingCityController.updateCity);
router.post('/mapcity-dd', auth, mappingCityController.listDropdown);

/* Mapping Hotel */
router.get('/sync-maphotel/:id', auth, mappingHotelController.syncMappingHotel);
router.post('/show-maphotel', auth, mappingHotelController.showMappingHotel);
router.post('/create-maphotel', auth, mappingHotelController.createHotel);
router.post('/createDida-maphotel', auth, mappingHotelController.createHotelDida);
router.put('/update-maphotel/:id', auth, mappingHotelController.updateHotel);
router.post('/maphotel-dd', auth, mappingHotelController.listDropdown);
router.post('/maphotelid-dd', auth, mappingHotelController.listDropdownById);

module.exports = router;