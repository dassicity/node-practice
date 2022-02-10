const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {          // connecting to the mongodb server
    mongoClient.connect('mongodb+srv://dassic:Dassic007@cluster0.ad9yl.mongodb.net/shop?retryWrites=true&w=majority')
        .then((client) => {
            // console.log("Connected!");
            _db = client.db();              // Here, we are exporting the database from the client through getDb method.
            callback(client);
        })
        .catch(err => {
            console.log(err);
        });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw ("No such database");
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;