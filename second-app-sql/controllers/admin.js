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

    // Using Sequelize
    Product.create({
        title: title,
        price: price,
        description: description,
        imageURL: imageURL
    })
        .then(result => {
            // console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

    // Without Using sequelize

    // const product = new Product(null, title, imageURL, description, price);
    // product.save()
    //     .then(() => {
    //         res.redirect('/products');
    //     })
    //     .catch(err => console.log(err));    
};

exports.getEditProducts = (req, res, next) => {
    const id = req.params.productID;
    // console.log(id);
    Product.findByPk(id)
        .then(product => {
            if (!product) {
                res.redirect('/404');
            }
            res.render('admin/edit-product.ejs', {
                title: 'Edit Product',
                path: '/admin/edit-product',
                product: product
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProducts = (req, res, next) => {
    const prodID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedURL = req.body.imageURL;
    const updatedDescription = req.body.description;

    Product.findByPk(prodID)
        .then(product => {
            // console.log(product);
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageURL = updatedURL;

            return product.save();
        })
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

    // const updatedProduct = new Product(prodID, updatedTitle, updatedURL, updatedDescription, updatedPrice);
    // updatedProduct.save();

    // res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productID;
    Product.findByPk(id)
        .then(product => {
            return product.destroy();
        })
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(product => {
            // console.log(product);
            res.render('admin/product-list.ejs', {
                prods: product,
                title: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch(err => console.log(err));

    // Product.fetchAll(products => {
    //     res.render('admin/product-list.ejs', {
    //         prods: products,
    //         title: 'Admin Products',
    //         path: '/admin/products',
    //     });
    // });
}