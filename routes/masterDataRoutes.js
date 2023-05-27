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
const holidaysController = require('../controllers/masterData/holidaysController');
const policyController = require('../controllers/cxl/policyController');
const policyDetailController = require('../controllers/cxl/policyDetailController');
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
router.get('/country-code-dd/', auth, msCountryCodeController.listDropdown);
//#endregion

//#region City Code
router.post('/city-code', auth, msCityCodeController.create);
router.get('/city-code', auth, msCityCodeController.list);
router.get('/city-code/:id', auth, msCityCodeController.detail);
router.put('/city-code/:id', auth, msCityCodeController.update);
router.delete('/city-code/:id', auth, msCityCodeController.destroy);
router.get('/city-code-dd/', auth, msCityCodeController.listDropdown);
//#endregion

//#region Nationality
router.post('/nationality', auth, nationalityController.create);
router.get('/nationality', auth, nationalityController.list);
router.get('/nationality/:id', auth, nationalityController.detail);
router.put('/nationality/:id', auth, nationalityController.update);
router.delete('/nationality/:id', auth, nationalityController.destroy);
router.get('/nationality-dd/', auth, nationalityController.listDropdown);
//#endregion

//#region City Location
router.post('/city-location', auth, cityLocationController.create);
router.get('/city-location', auth, cityLocationController.list);
router.get('/city-location/:id', auth, cityLocationController.detail);
router.put('/city-location/:id', auth, cityLocationController.update);
router.delete('/city-location/:id', auth, cityLocationController.destroy);
router.get('/city-location-dd/', auth, cityLocationController.listDropdown);
//#endregion

//#region Breakfast
router.post('/breakfast', auth, msBreakfastController.create);
router.get('/breakfast', auth, msBreakfastController.list);
router.get('/breakfast/:id', auth, msBreakfastController.detail);
router.put('/breakfast/:id', auth, msBreakfastController.update);
router.delete('/breakfast/:id', auth, msBreakfastController.destroy);
router.get('/breakfast-dd/', auth, msBreakfastController.listDropdown);
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
router.get('/payment-method-dd/', auth, msPaymentMethodController.listDropdown);
//#endregion

//#region Room Grade
router.post('/room-grade', auth, msRoomGradeController.create);
router.get('/room-grade', auth, msRoomGradeController.list);
router.get('/room-grade/:id', auth, msRoomGradeController.detail);
router.put('/room-grade/:id', auth, msRoomGradeController.update);
router.delete('/room-grade/:id', auth, msRoomGradeController.destroy);
router.get('/room-grade-dd/', auth, msRoomGradeController.listDropdown);
//#endregion

//#region Cxl Policy
router.post('/cxl-policy', auth, policyController.create);
router.get('/cxl-policy', auth, policyController.list);
router.get('/cxl-policy/:id', auth, policyController.detail);
router.put('/cxl-policy/:id', auth, policyController.update);
router.delete('/cxl-policy/:id', auth, policyController.destroy);
router.get('/cxl-policy-dd/', auth, policyController.listDropdown);
//#endregion

//#region Cxl Policy Detail
router.post('/cxl-policy-detail', auth, policyDetailController.create);
router.get('/cxl-policy-detail', auth, policyDetailController.list);
router.get('/cxl-policy-detail/:id', auth, policyDetailController.detail);
router.put('/cxl-policy-detail/:id', auth, policyDetailController.update);
router.delete('/cxl-policy-detail/:id', auth, policyDetailController.destroy);
//#endregion

//#region Session
router.post('/session', auth, msSessionController.create);
router.get('/session', auth, msSessionController.list);
router.get('/session/:id', auth, msSessionController.detail);
router.put('/session/:id', auth, msSessionController.update);
router.delete('/session/:id', auth, msSessionController.destroy);
router.get('/session-dd/', auth, msSessionController.listDropdown);
//#endregion

//#region Facility
router.post('/facility', auth, msFacilityController.create);
router.get('/facility', auth, msFacilityController.list);
router.get('/facility/:id', auth, msFacilityController.detail);
router.put('/facility/:id', auth, msFacilityController.update);
router.delete('/facility/:id', auth, msFacilityController.destroy);
router.get('/facility-dd/', auth, msFacilityController.listDropdown);
//#endregion

//#region Facility
router.get('/holiday', auth, holidaysController.list);
router.put('/holiday', auth, holidaysController.update);
//#endregion

module.exports = router;