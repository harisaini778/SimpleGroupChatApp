// /util/database.js

// const mysql = require('mysql');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password : "Sql123"
// })

// module.exports = pool;

const Sequelize = require('sequelize');


const sequelize = new Sequelize('node-complete', 'roor', 'Sql123', {
    dialect : 'mysql',
    host : 'localhost',
});

module.exports = sequelize;
