const fs = require('fs');
const path = require('path');

const pathToFile = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, price) {
        // fetch the previous cart
        fs.readFile(pathToFile, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // analyze the cart => look for existing products
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                // add new product/ increase the quantity of existing product
                updatedProduct.qty += 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice += +price;
            fs.writeFile(pathToFile, JSON.stringify(cart), (err) => {
                // console.log(err);
            });
        })

    }

    static deleteProductByID(id, productPrice) {
        fs.readFile(pathToFile, (err, fileContent) => {
            let updatedCart = { products: [], totalPrice: 0 };
            if (!err) {
                updatedCart = JSON.parse(fileContent);
            }
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            const productQty = product.qty;
            // updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            // updatedCart.products = updatedCart.products.forEach(prod => prod.qty = productQty - 1);
            updatedCart.products.forEach(prod => {
                if (prod.id === id) {
                    if (prod.qty = 1) {
                        updatedCart.products.filter(prod => prod.id !== id);
                    }
                    else {
                        prod.qty--;
                    }
                }
            });
            updatedCart.totalPrice -= productPrice;
            // console.log(updatedCart);
            fs.writeFile(pathToFile, JSON.stringify(updatedCart), (err) => {
                // console.log(err);
            });
        });
    }

    static getCart(callback) {
        fs.readFile(pathToFile, (err, fileContent) => {
            if (err) {
                callback(null);
            }
            else {
                const cart = JSON.parse(fileContent);
                callback(cart);
            }
        });
    }
};