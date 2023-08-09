const mysql = require('mysql');
const dotenv = require("dotenv");

dotenv.config({ path: '.env' });
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
    // insecureAuth: true
});

connection.connect();
console.log(`connected`);

module.exports = {
    connection,
};