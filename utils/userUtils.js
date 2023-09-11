const mysql = require("../config/database");
const {devlog} = require("../config/config");

exports.changeUserPass = (reqData, callback) => {
    console.log("model IN!!!!!!!!!!!!!");
    const { email, username, phonenum, newPass } = reqData;
    const sql = 'UPDATE users SET password = ? WHERE email = ? AND username = ? AND phoneNumber = ?';
    mysql.connection.query(sql, [String(newPass), email, username, String(phonenum)], (error, results) => {
        if (error) {
            devlog(`findUserEmail - Query 에러`);
            return callback(error, null);
        }

        if (results.length === 0) {
            devlog(`findUserEmail - 찾은 사용자 없음`);
            return callback(null, null); // 사용자가 없을 경우 null을 반환합니다.
        }

        // const user = results[0];
        return callback(null, results);
    });
}

exports.getUserByEmail = (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    mysql.connection.query(query, email, (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length === 0) {
            return callback(null, null); // 사용자가 없을 경우 null을 반환합니다.
        }

        const user = results[0];
        return callback(null, user);
    });
}

