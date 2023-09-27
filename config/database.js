const mysql = require('mysql');
const dotenv = require("dotenv");

dotenv.config({ path: '.env' });
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements : true // 여러 쿼리를 세미콜론으로 구분시켜 한번에 전송 가능
});

connection.connect();
console.log(`MySQL 접속 완료`);

module.exports = {
    connection,
};