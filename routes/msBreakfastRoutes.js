"use strict"

const msBreakfastController = require('./../controllers/masterData/msBreakfastController');
const auth = require('../middlewares/auth');

const router = require('express').Router();
const extractFile = require('../middlewares/check-img-mime-type');
const middleErrMsg = require('../config/errorMsg');

router.post('/msBreakfast', auth, extractFile, msBreakfastController.addMsBreakfasts, middleErrMsg);
router.get('/msBreakfasts', auth, msBreakfastController.getMsBreakfasts);
router.get('/msBreakfast/:id', auth, msBreakfastController.getMsBreakfast);
router.put('/msBreakfast/:id', auth, extractFile, msBreakfastController.editMsBreakfast);
router.delete('/msBreakfast/:id', auth, msBreakfastController.deleteMsBreakfast);



module.exports = router;