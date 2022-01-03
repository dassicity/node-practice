const express = require('express');
// const path = require('path');

const router = express.Router();

const shopRouter = require('../controllers/shop');

router.get('/', shopRouter.showIndex);

router.get('/products', shopRouter.showProducts);

router.get('/products/:productID', shopRouter.showProduct);    // With : you tell express that after /products there will come a path

router.get('/cart', shopRouter.showCart);

router.post('/add-to-cart', shopRouter.postCart);

router.post('/cart-delete-item', shopRouter.postDeleteCartItem);

router.get('/orders', shopRouter.showOrders);

router.get('/checkout');

module.exports = router;