"use strict"

const hotelExtraController = require('../controllers/hotel/extraController');
const hotelFacilityController = require('../controllers/hotel/facilityController');
const hotelRoomGradeController = require('../controllers/hotel/roomGradeController');
const hotelSupplierController = require('../controllers/hotel/supplierController');
const auth = require('../middlewares/auth');

const router = require('express').Router();
const extractFile = require('../middlewares/check-img-mime-type');
const middleErrMsg = require('../config/errorMsg');
const { masterChargeTypes } = require('../config/sequelize');

//#region Facilities
router.post('/facilities', auth, extractFile, hotelFacilityController.addMsHotelFacilitys, middleErrMsg);
router.get('/facilities', auth, hotelFacilityController.getMsHotelFacilitys);
router.get('/facilities/:id', auth, hotelFacilityController.getMsHotelFacility);
router.put('/facilities/:id', auth, extractFile, hotelFacilityController.editMsHotelFacility);
router.delete('/facilities/:id', auth, hotelFacilityController.deleteMsHotelFacility);
//#endregion

module.exports = router;