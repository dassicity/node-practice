const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProductPage = (req, res, next) => {
    res.render('admin/add-product.ejs', {
        title: 'Add Product',
        path: '/admin/add-product',
        isAuthenticated: false,
    });
};

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, imageURL, description, price, null, req.user._id);
    product.save()
        .then(() => {
            res.redirect('/products');
        })
        .catch();
    // console.log(products);
};

exports.getEditProducts = (req, res, next) => {
    const id = req.params.productID;
    // console.log(id);
    Product.fetchById(id)
        .then(product => {
            if (!product) {
                res.redirect('/404');
            }
            res.render('admin/edit-product.ejs', {
                title: 'Edit Product',
                path: '/admin/edit-product',
                product: product,
                isAuthenticated: false
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postEditProducts = (req, res, next) => {
    const prodID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedURL = req.body.imageURL;
    const updatedDescription = req.body.description;

    const updatedProduct = new Product(updatedTitle, updatedURL, updatedDescription, updatedPrice, new mongodb.ObjectId(prodID));
    updatedProduct.save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });

};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.deleteById(id)
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/product-list.ejs', {
                prods: products,
                title: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: false
            })
        }
        )
        .catch(err => {
            console.log(err);
        });
};
