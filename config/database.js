const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '49.247.43.150',
    user: 'wayne',
    password: '12341234aS!',
    database: 'my_db',
    insecureAuth: true
});

connection.connect();
console.log(`connected`);

module.exports = {
    connection,
};