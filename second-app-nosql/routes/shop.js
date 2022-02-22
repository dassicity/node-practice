const express = require('express');
// const path = require('path');

const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.showIndex);

router.get('/products', shopController.showProducts);

router.get('/products/:productID', shopController.showProduct);    // With : you tell express that after /products there will come a path

router.get('/cart', shopController.showCart);

router.post('/add-to-cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postDeleteCartItem);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.showOrders);

router.get('/checkout');

module.exports = router;