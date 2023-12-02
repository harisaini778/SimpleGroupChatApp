// /util/database.js

const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password : "Sql123"
})

module.exports = pool;


