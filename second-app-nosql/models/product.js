const mongoConnect = require('../util/database');

class Product {
    constructor(title, imageURL, description, price) {
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }

    save() {

    }
}

module.exports = Product;