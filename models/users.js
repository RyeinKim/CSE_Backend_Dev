const mysql = require('../config/database');

/**
 * 회원 정보 목록 조회
 * 회원 전화번호 업데이트
 * 회원 정보 삭제
 */

// 회원 정보 목록 조회
exports.loadUsers = (callback) => {
    const sql = 'SELECT * FROM users';
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

// 회원 전화번호 업데이트
exports.updateUser = (email, phoneNumber, callback) => {
    const sql = `UPDATE users SET phoneNumber='${phoneNumber}' WHERE email='${email}';`
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

// 회원 정보 삭제
exports.deleteUser = (id, callback) => {
    const sql = `DELETE FROM users WHERE id = ${id};`;
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}