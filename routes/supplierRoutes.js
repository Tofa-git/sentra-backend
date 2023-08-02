"use strict"
const suppliersController = require('./../controllers/supplier/supplierController');
const managerController = require('./../controllers/supplier/managerController');
const apiController = require('./../controllers/supplier/apiController');
const emergencyController = require('./../controllers/supplier/emergencyController');
const router = require('express').Router();
const auth = require('../middlewares/auth');

//#region Suppliers
router.post('/supplier', auth,suppliersController.createSupplier);
router.get('/supplier/:id', auth, suppliersController.getSupplier);
router.get('/supplier-dd', auth, suppliersController.supplierDD);
router.get('/suppliers', auth, suppliersController.getSuppliers);
router.put('/supplier/:id', auth, suppliersController.update);
router.delete('/supplier/:id', auth, suppliersController.destroy);
//#endregion

//#region Suppliers Manager
router.post('/supplier/manager', auth,managerController.createSupman);
router.get('/supplier/manager/:id', auth, managerController.getSupman);
router.get('/supplier/manager-dd', auth, managerController.supmanDD);
router.get('/suppliers/managers', auth, managerController.getSupmans);
router.put('/supplier/manager/:id', auth, managerController.update);
router.delete('/supplier/manager/:id', auth, managerController.destroy);
//#endregion

//#region Suppliers API
router.post('/supplier/api', auth,apiController.createSupApi);
router.get('/supplier/api/:id', auth, apiController.getSupApi);
router.get('/supplier/api-dd', auth, apiController.supApiDD);
router.get('/suppliers/apis', auth, apiController.getSupApis);
router.put('/supplier/api/:id', auth, apiController.update);
router.delete('/supplier/api/:id', auth, apiController.destroy);
//#endregion

//#region Suppliers Emergency
router.post('/supplier/emergency', auth,emergencyController.createSupEmerg);
router.get('/supplier/emergency/:id', auth, emergencyController.getSupEmerg);
router.get('/supplier/emergency-dd', auth, emergencyController.supEmergDD);
router.get('/suppliers/emergencys', auth, emergencyController.getSupEmergs);
router.put('/supplier/emergency/:id', auth, emergencyController.update);
router.delete('/supplier/emergency/:id', auth, emergencyController.destroy);
//#endregion

module.exports = router;
