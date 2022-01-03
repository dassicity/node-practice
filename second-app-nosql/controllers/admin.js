const Product = require('../models/product');

exports.getAddProductPage = (req, res, next) => {
    res.render('admin/add-product.ejs', {
        title: 'Add Product',
        path: '/admin/add-product',
    });
};

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(null, title, imageURL, description, price);
    product.save();
    // console.log(products);
    res.redirect('/products');
};

exports.getEditProducts = (req, res, next) => {
    const id = req.params.productID;
    // console.log(id);
    Product.findProductByID(id, product => {
        if (!product) {
            res.redirect('/404');
        }
        res.render('admin/edit-product.ejs', {
            title: 'Edit Product',
            path: '/admin/edit-product',
            product: product
        });
    });
};

exports.postEditProducts = (req, res, next) => {
    const prodID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedURL = req.body.imageURL;
    const updatedDescription = req.body.description;

    const updatedProduct = new Product(prodID, updatedTitle, updatedURL, updatedDescription, updatedPrice);
    updatedProduct.save();

    res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productID;
    Product.deleteById(id);
    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/product-list.ejs', {
            prods: products,
            title: 'Admin Products',
            path: '/admin/products',
        });
    });
}