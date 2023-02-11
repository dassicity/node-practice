const path = require('path');

const express = require('express');
const { check, body } = require('express-validator/check')

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    isAuth,
    body('price').isFloat().withMessage('Enter a valid price of the product!'),
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    isAuth,
    body('price').isFloat().withMessage('Enter a valid price of the product!'),
    adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;