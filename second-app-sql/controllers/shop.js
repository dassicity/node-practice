const Cart = require('../models/cart');
const Product = require('../models/product');

exports.showProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list.ejs', {
                prods: products,
                title: 'All Products',
                path: '/products',
            });
        })
        .catch(err => console.log(err));
    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //         res.render('shop/product-list.ejs', {
    //             prods: rows,
    //             title: 'All Products',
    //             path: '/products',
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
};

exports.showProduct = (req, res, next) => {
    const id = req.params.productID;
    Product.findByPk(id)
        .then(product => {
            // console.log(product);
            res.render('shop/product-detail.ejs', {
                prods: product,
                path: `products/${id}`,
                title: product.title
            });
        })
        .catch(err => console.log(err));

    // Product.findProductByID(id)
    //     .then(([[product]]) => {
    //         // console.log(result);
    //         res.render('shop/product-detail.ejs', {
    //             prods: product,
    //             path: `/products/${id}`,
    //             title: 'This Product'
    //         });
    //     })
    //     .catch(err => console.log(err));

};

exports.showIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index.ejs', {
                prods: products,
                title: 'My Shop',
                path: '/',
            });
        })
        .catch(err => console.log(err));


    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //         res.render('shop/index.ejs', {
    //             prods: rows,
    //             title: 'My Shop',
    //             path: '/',
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
};

exports.showCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (let product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            // console.log(cartProducts);
            res.render('shop/cart.ejs', {
                title: 'My Cart',
                path: '/cart',
                products: cartProducts
            });
        })
    })
}

exports.postCart = (req, res, next) => {
    const id = req.body.productID;
    Product.findProductByID(id, product => {
        Cart.addProduct(product.id, product.price);
    })
    res.redirect('/cart');
};

exports.postDeleteCartItem = (req, res, next) => {
    const id = req.body.productID;
    // console.log(id);
    Product.findProductByID(id, product => {
        Cart.deleteProductByID(id, product.price);
    });
    res.redirect('/cart');
};

exports.showOrders = (req, res, next) => {
    res.render('shop/orders.ejs', {
        title: 'My Orders',
        path: '/orders',
    });
}

exports.showCheckout = (req, res, next) => {
    res.render('shop/checkout.ejs', {
        title: 'Checkout',
        path: '/checkout'
    })
}