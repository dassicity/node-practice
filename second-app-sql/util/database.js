//////////// Without Sequelize //////////////////////

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'second-app',
//     password: 'Dassic#007',
// });

// module.exports = pool.promise();

/////////// Using Sequelize ////////////////
const Sequelize = require('sequelize');     // This here returns a class or constructor function hence the name

const sequelize = new Sequelize('second-app', 'root', 'Dassic#007', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;