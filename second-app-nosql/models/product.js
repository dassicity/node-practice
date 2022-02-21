const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
    constructor(title, imageURL, description, price, id, userId) {
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
        this._id = id;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            // Update the product
            dbOp = db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
        }
        else {
            // Create new product
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
            .then(result => {
                // console.log(result);
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

    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then()
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = Product;