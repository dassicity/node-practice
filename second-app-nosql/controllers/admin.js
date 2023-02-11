const Product = require('../models/product');
const { validationResult } = require('express-validator/check')
const mongoose = require('mongoose');
const fs = require('fs');

const fileHelper = require('../util/fileHelper');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        // editing: false,
        errorMessage: '',
        oldData: { title: '', imageUrl: '', price: '', description: '' }
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    // console.log(imageUrl);
    // console.log(price);
    // console.log("Above this line");
    const error = validationResult(req);

    if (!image) {
        return res.status(422).render('admin/add-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            // editing: false,
            errorMessage: "Please upload a valid image",
            oldData: { title: title, price: price, description: description },
        });
    }

    // console.log(error);
    if (!error.isEmpty()) {
        return res.status(422).render('admin/add-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            // editing: false,
            errorMessage: error.array()[0].msg,
            oldData: { title: title, price: price, description: description },
        });
    }

    const imageUrl = image.path;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product
        .save()
        .then(result => {
            // console.log(result);
            console.log('Created Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            // console.log(err);
            // return res.status(500).render('admin/add-product', {
            //     pageTitle: 'Add Product',
            //     path: '/admin/add-product',
            //     // editing: false,
            //     errorMessage: 'Some error occurred on our end',
            //     oldData: { title: title, imageUrl: imageUrl, price: price, description: description },
            // });
            // res.redirect('/500');
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                errorMessage: '',
                hasError: false,
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    const image = req.file;

    const error = validationResult(req);
    // console.log(error);
    if (!error.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: false,
            errorMessage: error.array()[0].msg,
            hasError: true,
            product: { _id: prodId, title: updatedTitle, imageUrl: updatedImageUrl, price: updatedPrice, description: updatedDesc },
        });
    }
    console.log(prodId);


    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/')
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            if (image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
                // console.log(product.imageUrl);
            };
            return product.save()
                .then(result => {
                    console.log('UPDATED PRODUCT!');
                    res.redirect('/admin/products');
                })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            // console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error("Product not found!"))
            }
            req.user.removeFromCart(prodId);
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: prodId, userId: req.user._id });
        })
        .then(() => {
            console.log('DESTROYED PRODUCT');
            // res.redirect('/admin/products');
            res.status(200).json({
                message: "Success!"
            })
        })
        .catch(err => {
            // const error = new Error(err);
            // error.httpStatusCode = 500;
            // next(error);
            res.status(500).json({
                message: "Failed!"
            })
        });
};