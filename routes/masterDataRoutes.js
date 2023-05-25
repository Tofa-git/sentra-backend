"use strict"

const msCountryCodeController = require('../controllers/masterLocationData/msCountryCodeController');
const msCityCodeController = require('../controllers/masterLocationData/msCityCodeController');
const nationalityController = require('../controllers/masterLocationData/nationalityController');
const cityLocationController = require('../controllers/masterLocationData/msCityLocationController');
const msBreakfastController = require('../controllers/masterData/msBreakfastController');
const msChargeController = require('../controllers/masterData/msChargeController');
const msCurrencyController = require('../controllers/masterData/msCurrencyController');
const msHotelController = require('../controllers/masterData/msHotelController');
const msPaymentMethodController = require('../controllers/masterData/msPaymentMethodController');
const msRoomGradeController = require('../controllers/masterData/msRoomGradeController');
const msSessionController = require('../controllers/masterData/msSessionController');
const msFacilityController = require('../controllers/masterData/msFacilitiesController');
const auth = require('../middlewares/auth');

const router = require('express').Router();
const extractFile = require('../middlewares/check-img-mime-type');
const middleErrMsg = require('../config/errorMsg');

//#region City Code
router.post('/country-code', auth, msCountryCodeController.create);
router.get('/country-code', auth, msCountryCodeController.list);
router.get('/country-code/:id', auth, msCountryCodeController.detail);
router.put('/country-code/:id', auth, msCountryCodeController.update);
router.delete('/country-code/:id', auth, msCountryCodeController.destroy);
//#endregion

//#region City Code
router.post('/city-code', auth, msCityCodeController.create);
router.get('/city-code', auth, msCityCodeController.list);
router.get('/city-code/:id', auth, msCityCodeController.detail);
router.put('/city-code/:id', auth, msCityCodeController.update);
router.delete('/city-code/:id', auth, msCityCodeController.destroy);
//#endregion

//#region Nationality
router.post('/nationality', auth, nationalityController.create);
router.get('/nationality', auth, nationalityController.list);
router.get('/nationality/:id', auth, nationalityController.detail);
router.put('/nationality/:id', auth, nationalityController.update);
router.delete('/nationality/:id', auth, nationalityController.destroy);
//#endregion

//#region City Location
router.post('/city-location', auth, cityLocationController.create);
router.get('/city-location', auth, cityLocationController.list);
router.get('/city-location/:id', auth, cityLocationController.detail);
router.put('/city-location/:id', auth, cityLocationController.update);
router.delete('/city-location/:id', auth, cityLocationController.destroy);
//#endregion

//#region Breakfast
router.post('/breakfast', auth, msBreakfastController.create);
router.get('/breakfast', auth, msBreakfastController.list);
router.get('/breakfast/:id', auth, msBreakfastController.detail);
router.put('/breakfast/:id', auth, msBreakfastController.update);
router.delete('/breakfast/:id', auth, msBreakfastController.destroy);
//#endregion

//#region Charge
router.post('/chargetype', auth, extractFile, msChargeController.addMsCharges, middleErrMsg);
router.get('/chargetype', auth, msChargeController.getMsCharges);
router.get('/chargetype/:id', auth, msChargeController.getMsCharge);
router.put('/chargetype/:id', auth, extractFile, msChargeController.editMsCharge);
router.delete('/chargetype/:id', auth, msChargeController.deleteMsCharge);
//#endregion

//#region Currency
router.post('/currency', auth, extractFile, msCurrencyController.addMsCurrencys, middleErrMsg);
router.get('/currency', auth, msCurrencyController.getMsCurrencys);
router.get('/currency/:id', auth, msCurrencyController.getMsCurrency);
router.put('/currency/:id', auth, extractFile, msCurrencyController.editMsCurrency);
router.delete('/currency/:id', auth, msCurrencyController.deleteMsCurrency);
//#endregion

//#region Hotel
router.post('/hotel', auth, extractFile, msHotelController.addMsHotels, middleErrMsg);
router.get('/hotel', auth, msHotelController.getMsHotels);
router.get('/hotel/:id', auth, msHotelController.getMsHotel);
router.put('/hotel/:id', auth, extractFile, msHotelController.editMsHotel);
router.delete('/hotel/:id', auth, msHotelController.deleteMsHotel);
//#endregion

//#region Payment Method
router.post('/payment-method', auth, msPaymentMethodController.create);
router.get('/payment-method', auth, msPaymentMethodController.list);
router.get('/payment-method/:id', auth, msPaymentMethodController.detail);
router.put('/payment-method/:id', auth, msPaymentMethodController.update);
router.delete('/payment-method/:id', auth, msPaymentMethodController.destroy);
//#endregion

//#region Room Grade
router.post('/room-grade', auth, msRoomGradeController.create);
router.get('/room-grade', auth, msRoomGradeController.list);
router.get('/room-grade/:id', auth, msRoomGradeController.detail);
router.put('/room-grade/:id', auth, msRoomGradeController.update);
router.delete('/room-grade/:id', auth, msRoomGradeController.destroy);
//#endregion
//#endregion

//#region Session
router.post('/session', auth, extractFile, msSessionController.addMsSessions, middleErrMsg);
router.get('/session', auth, msSessionController.getMsSessions);
router.get('/session/:id', auth, msSessionController.getMsSession);
router.put('/session/:id', auth, extractFile, msSessionController.editMsSession);
router.delete('/session/:id', auth, msSessionController.deleteMsSession);
//#endregion

//#region Facility
router.post('/facility', auth, msFacilityController.create);
router.get('/facility', auth, msFacilityController.list);
router.get('/facility/:id', auth, msFacilityController.detail);
router.put('/facility/:id', auth, msFacilityController.update);
router.delete('/facility/:id', auth, msFacilityController.destroy);
//#endregion

module.exports = router;