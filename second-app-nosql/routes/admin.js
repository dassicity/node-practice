const express = require('express');
// const fs = require('fs');
// const path = require('path');

const adminController = require('../controllers/admin');
const { route } = require('./shop');

const router = express.Router();

// GET requests for loading a new page. POST for processing request with data from a previous page
router.get('/admin/add-product', adminController.getAddProductPage);

router.post('/admin/add-product', adminController.postAddProducts);

router.get('/admin/products', adminController.getProducts);

router.get('/admin/edit-product/:productID', adminController.getEditProducts);

router.post('/admin/edit-product', adminController.postEditProducts);

router.post('/admin/delete-product', adminController.postDeleteProduct);

module.exports = router;
