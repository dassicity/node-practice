const Product = require('../models/product');
const Order = require('../models/order');

exports.showProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list.ejs', {
                prods: products,
                title: 'All Products',
                path: '/products',
                isAuthenticated: true
            })
        })
        .catch(err => {
            console.log(err);
        })
    // console.log(adminData.products);
    // res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));

};

exports.showIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index.ejs', {
                prods: products,
                title: 'My Shop',
                path: '/',
                isAuthenticated: false
            })
        })
        .catch(err => {
            console.log(err);
        })
};

exports.showProduct = (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
        .then(product => {
            // console.log(product);
            res.render('shop/product-detail.ejs', {
                prods: product,
                path: `/products/${id}`,
                title: 'This Product',
                isAuthenticated: false
            })
        })
        .catch(err => {
            console.log(err);
        })
};


exports.showCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                title: 'Your Cart',
                products: products,
                isAuthenticated: false
            });
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productID;
    // console.log(productId);
    Product.findById(productId)
        .then(product => {
            // console.log(product);
            return req.user.addToCart(product);
        })
        .then(result => {
            // console.log(result);
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postDeleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.showOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                title: 'Your Orders',
                orders: orders,
                isAuthenticated: false
            });
        })
        .catch(err => console.log(err));
}

exports.showCheckout = (req, res, next) => {
    res.render('shop/checkout.ejs', {
        title: 'Checkout',
        path: '/checkout'
    })
}