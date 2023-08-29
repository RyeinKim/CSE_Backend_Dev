const mysql = require('../config/database');
const {devlog} = require("../config/config");

/**
 * 회원 정보 목록 조회
 * 회원 전화번호 업데이트
 * 회원 정보 삭제
 * 회원 로그인
 */

// 회원 정보 목록 조회
exports.loadUsers = (reqData, callback) => {
    console.log("[Model] loadUsers in");
    const sql = `SELECT * FROM users LIMIT ${reqData.limit} OFFSET ${reqData.offset};`;
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}


// 회원 전화번호 업데이트
exports.updateUser = (reqData, callback) => {
    console.log('update in');
    console.log(`req.session = `, reqData.session);
    const sql = `UPDATE users SET phoneNumber='${reqData.phoneNumber}' WHERE email='${reqData.email}';`
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        if (results.affectedRows === 0) {
            return callback(null, null);
        }
        return callback(null, results);
    });
}

// 회원 정보 삭제
exports.deleteUser = (reqData) => {
    console.log('delete in');
    devlog(`[Model] reqData.user_id = ${reqData.user_id}`);
    const {user_id} = reqData;
    const currentDate = new Date();
    const sql = `UPDATE users SET deleteAt = ? WHERE id = ?;`;

    mysql.connection.query(sql, [currentDate, user_id], (error, result) => {
        if (error) {
            console.error(error);
        } else {
            console.log(`User with id ${user_id} has been deleted.`);
        }
    })
}
/*exports.deleteUser = (reqData, callback) => {
    console.log('delete in');
    devlog(`[Model] reqData.user_id = ${reqData.user_id}`);
    const sql = `DELETE FROM users WHERE id = ${reqData.user_id};`;
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        if (results.affectedRows === 0) {
            return callback(null, null);
        }
        return callback(null, 'deleted');
    });
}*/

// 회원 로그인
exports.loginUser = (reqData, callback) => {
    console.log('login in');
    const reqPassword = reqData.password;
    // console.log(`reqPassword = `, reqPassword);
    const sql = `SELECT * FROM users WHERE email = '${reqData.email}'`;
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (!results[0]) {
            return callback(null, null);
        }

        if (reqPassword !== results[0].password) {
            return callback(null, null);
        }
        // console.log(`results[0] = `, results[0]);
        // console.log(`reqData.session = `, reqData.session);
        console.log(JSON.stringify(results, null, 2));
        return callback(null, results[0].id);
    });
}

/*
exports.loadUsers = (reqData, callback) => {
    console.log("loadUsers in");
    const reqLimit = reqData.limit.slice(1, -1);
    const reqOffset = reqData.offset.slice(1, -1);
    const sql = `SELECT * FROM users limit ${reqLimit} offset ${reqOffset};`;
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}
*/