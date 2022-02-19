const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
    constructor(title, imageURL, description, price) {
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }

    save() {
        const db = getDb();
        return db.collection('products')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err)
            });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log("Fetched!");
                return products;
            })
            .catch(err => {
                console.log(err);
            })
    }

    static fetchById(prodId) {
        const db = getDb();
        return db.collection('products')
            .find({ _id: new mongodb.ObjectId(prodId) })
            .next()
            .then(product => {
                // console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Product;