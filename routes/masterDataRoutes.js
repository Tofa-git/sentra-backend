"use strict"

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
const { masterChargeTypes } = require('../config/sequelize');

//#region Breakfast
router.post('/breakfast', auth, extractFile, msBreakfastController.addMsBreakfasts, middleErrMsg);
router.get('/breakfast', auth, msBreakfastController.getMsBreakfasts);
router.get('/breakfast/:id', auth, msBreakfastController.getMsBreakfast);
router.put('/breakfast/:id', auth, extractFile, msBreakfastController.editMsBreakfast);
router.delete('/breakfast/:id', auth, msBreakfastController.deleteMsBreakfast);
//#endregion

//#region Charge
router.post('/chargetype', auth, extractFile, msChargeController.addMsCharges, middleErrMsg);
router.get('/chargetype', auth, msChargeController.getMsCharges);
router.get('/chargetype/:id', auth, msChargeController.getMsCharge);
router.put('/chargetype/:id', auth, extractFile, msChargeController.editMsCharge);
router.delete('/chargetype/:id', auth, msChargeController.deleteMsCharge  );
//#endregion

//#region Currency
router.post('/currency', auth, extractFile, msCurrencyController.addMsCurrencys, middleErrMsg);
router.get('/currency', auth, msCurrencyController.getMsCurrencys);
router.get('/currency/:id', auth, msCurrencyController.getMsCurrency);
router.put('/currency/:id', auth, extractFile, msCurrencyController.editMsCurrency);
router.delete('/currency/:id', auth, msCurrencyController.deleteMsCurrency  );
//#endregion

//#region Hotel
router.post('/hotel', auth, extractFile, msHotelController.addMsHotels, middleErrMsg);
router.get('/hotel', auth, msHotelController.getMsHotels);
router.get('/hotel/:id', auth, msHotelController.getMsHotel);
router.put('/hotel/:id', auth, extractFile, msHotelController.editMsHotel);
router.delete('/hotel/:id', auth, msHotelController.deleteMsHotel);
//#endregion

//#region Payment Method
router.post('/payment-method', auth, extractFile, msPaymentMethodController.addMsPayments, middleErrMsg);
router.get('/payment-method', auth, msPaymentMethodController.getMsPayments);
router.get('/payment-method/:id', auth, msPaymentMethodController.getMsPayment);
router.put('/payment-method/:id', auth, extractFile, msPaymentMethodController.editMsPayment);
router.delete('/payment-method/:id', auth, msPaymentMethodController.deleteMsPayment);
//#endregion

//#region Room Grade
router.post('/room-grade', auth, extractFile, msRoomGradeController.addMsRoomGrades, middleErrMsg);
router.get('/room-grade', auth, msRoomGradeController.getMsRoomGrades);
router.get('/room-grade/:id', auth, msRoomGradeController.getMsRoomGrade);
router.put('/room-grade/:id', auth, extractFile, msRoomGradeController.editMsRoomGrade);
router.delete('/room-grade/:id', auth, msRoomGradeController.deleteMsRoomGrade);
//#endregion

//#region Session
router.post('/session', auth, extractFile, msSessionController.addMsSessions, middleErrMsg);
router.get('/session', auth, msSessionController.getMsSessions);
router.get('/session/:id', auth, msSessionController.getMsSession);
router.put('/session/:id', auth, extractFile, msSessionController.editMsSession);
router.delete('/session/:id', auth, msSessionController.deleteMsSession);
//#endregion

//#region Facility
router.post('/facility', auth, extractFile, msFacilityController.addMsFacilities, middleErrMsg);
router.get('/facility', msFacilityController.getMsFacilities);
router.get('/facility/:id', auth, msFacilityController.getMsFacility);
router.put('/facility/:id', auth, extractFile, msFacilityController.editMsFacility);
router.delete('/facility/:id', auth, msFacilityController.deleteMsFacility);
//#endregion

module.exports = router;