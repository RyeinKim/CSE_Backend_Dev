const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'wayne',
    password: '12341234aS!',
    database: 'my_db'
});

connection.connect();
console.log(`connected`);

module.exports = {
    connection,
};