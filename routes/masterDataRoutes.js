"use strict"

const msBreakfastController = require('../controllers/masterData/msBreakfastController');
const msChargeController = require('../controllers/masterData/msChargeController');
const auth = require('../middlewares/auth');

const router = require('express').Router();
const extractFile = require('../middlewares/check-img-mime-type');
const middleErrMsg = require('../config/errorMsg');
const { masterChargeTypes } = require('../config/sequelize');

//#region Breakfast
router.post('/msBreakfast', auth, extractFile, msBreakfastController.addMsBreakfasts, middleErrMsg);
router.get('/msBreakfasts', auth, msBreakfastController.getMsBreakfasts);
router.get('/msBreakfast/:id', auth, msBreakfastController.getMsBreakfast);
router.put('/msBreakfast/:id', auth, extractFile, msBreakfastController.editMsBreakfast);
router.delete('/msBreakfast/:id', auth, msBreakfastController.deleteMsBreakfast);
//#endregion

//#region Charge
router.post('/msChargeType', auth, extractFile, msChargeController.addMsCharges, middleErrMsg);
router.get('/msChargeTypes', auth, msChargeController.getMsCharges);
router.get('/msChargeType/:id', auth, msChargeController.getMsCharges);
router.put('/msChargeType/:id', auth, extractFile, msChargeController.editMsCharge);
router.delete('/msChargeType/:id', auth, msChargeController.deleteMsCharge  );
//#endregion

module.exports = router;