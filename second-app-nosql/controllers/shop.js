const Product = require('../models/product');

exports.showProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list.ejs', {
                prods: products,
                title: 'All Products',
                path: '/products',
                isAuthenticated: false
            })
        })
        .catch()
    // console.log(adminData.products);
    // res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));

};

exports.showIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index.ejs', {
                prods: products,
                title: 'My Shop',
                path: '/',
                isAuthenticated: false
            })
        })
        .catch()
};

exports.showProduct = (req, res, next) => {
    const id = req.params.productID;
    Product.fetchById(id)
        .then(product => {
            // console.log(product);
            res.render('shop/product-detail.ejs', {
                prods: product,
                path: `/products/${id}`,
                title: 'This Product',
                isAuthenticated: false
            })
        }
        )
        .catch(err => {
            console.log(err);
        })
};


exports.showCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            // console.log(products);
            res.render('shop/cart', {
                title: "Cart",
                path: "/cart",
                products: products,
                isAuthenticated: false
            })
        })
        .catch(err => {
            console.log(err);
        })

}

exports.postCart = (req, res, next) => {
    const productId = req.body.productID;
    // console.log(productId);
    Product.fetchById(productId)
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
    req.user.deleteCartItem(prodId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })

};

exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(() => {
            res.redirect('/orders');
        })
        .catch()
}

exports.showOrders = (req, res, next) => {
    req.user
        .showOrder()
        .then((orders) => {
            res.render('shop/orders.ejs', {
                title: 'My Orders',
                path: '/orders',
                orders: orders,
                isAuthenticated: false
            })
        })
        .catch(err => console.log(err));
}

exports.showCheckout = (req, res, next) => {
    res.render('shop/checkout.ejs', {
        title: 'Checkout',
        path: '/checkout'
    })
}