"use strict"
const suppliersController = require('./../controllers/supplier/supplierController');
const managerController = require('./../controllers/supplier/managerController');
const router = require('express').Router();
const auth = require('../middlewares/auth');

//#region Suppliers
router.post('/supplier', suppliersController.createSupplier);

router.get('/supplier/:id', auth, suppliersController.getSupplier);

router.get('/supplier-dd', auth, suppliersController.supplierDD);

router.get('/suppliers', auth, suppliersController.getSuppliers);
//#endregion

//#region Suppliers Manager
router.post('/supplier/manager', managerController.createSupman);

router.get('/supplier/manager/:id', auth, managerController.getSupman);

router.get('/supplier/manager-dd', auth, managerController.supmanDD);

router.get('/supplier/managers', auth, managerController.getSupmans);
//#endregion

module.exports = router;
