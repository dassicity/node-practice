const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const mongoConnect = callback => {          // connecting to the mongodb server
    mongoClient.connect('mongodb+srv://dassic:FRFdAaxfT4WNYkPe@cluster0.ad9yl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
        .then((client) => {
            console.log("Connected!");
            callback(client);
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = mongoConnect;