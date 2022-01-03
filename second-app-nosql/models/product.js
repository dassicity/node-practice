const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const pathToFile = path.join(path.dirname(require.main.filename), 'data', 'products.json');

// const getProductsFromFile =

module.exports = class Product {
    constructor(id, title, imageURL, description, price) {
        this.id = id;
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }

    save() {
        fs.readFile(pathToFile, (err, fileContent) => {
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }
            if (this.id) {
                const updateProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[updateProductIndex] = this;
                fs.writeFile(pathToFile, JSON.stringify(updatedProducts), (err) => {
                    // console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(pathToFile, JSON.stringify(products), (err) => {
                    // console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        fs.readFile(pathToFile, (err, fileContent) => {
            if (err) {
                return [];
            }
            else {
                // console.log(JSON.parse(fileContent));
                const products = JSON.parse(fileContent);
                const product = products.find(prod => prod.id === id);
                const updatedProducts = products.filter(p => p.id !== id);
                fs.writeFile(pathToFile, JSON.stringify(updatedProducts), (err) => {
                    // console.log(err);
                    if (!err) {
                        Cart.deleteProductByID(id, product.price);
                    }
                });
            }
        });
    }

    static fetchAll(callBack) {
        fs.readFile(pathToFile, (err, fileContent) => {
            if (err) {
                callBack([]);
            }
            else {
                // console.log(JSON.parse(fileContent));
                callBack(JSON.parse(fileContent));
            }
        });
    }

    static findProductByID(prodID, callBack) {
        fs.readFile(pathToFile, (err, fileContent) => {
            if (err) {
                callBack([]);
            }
            else {
                // console.log(JSON.parse(fileContent));
                const products = JSON.parse(fileContent);
                const product = products.find(p => p.id === prodID);
                callBack(product);
            }
        });
    }
}