const mysql = require('../config/database');
const {devlog} = require("../config/config");

/**
 * 회원 정보 목록 조회
 * 회원 전화번호 업데이트
 * 회원 정보 삭제
 * 회원 로그인
 * 이메일로 유저정보 가져오기
 */

// 회원 정보 목록 조회
/*
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
*/


exports.loadUsers = (reqData) => {
    return new Promise((resolve, reject) => {
        console.log("[Model] loadUsers in");
        const sql = `SELECT * FROM users LIMIT ${reqData.limit} OFFSET ${reqData.offset};`;
        mysql.connection.query(sql, (error, results) => {
            if (error) {
                console.log('reject in');
                reject(error);
            } else {
                console.log('resolve in');
                resolve(results);
            }
        });
    })
}


// 회원 전화번호 업데이트
/*exports.updateUser = (reqData, callback) => {
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
}*/
exports.updateUser = (reqData) => {
    return new Promise((resolve, reject) => {
        console.log('update in');
        console.log(`req.session = `, reqData.session);
        const sql = `UPDATE users SET phoneNumber='${reqData.phoneNumber}' WHERE email='${reqData.email}';`
        mysql.connection.query(sql, (error, results) => {
            if (error) {
                reject(error);
            }
            if (results.affectedRows === 0) {
                reject(null);
            }
            resolve(results);
        });
    })
}


// 회원 정보 삭제
/*exports.deleteUser = (reqData, callback) => {
    console.log('delete in');
    devlog(`[Model] reqData.user_id = ${reqData.user_id}`);
    const {user_id} = reqData;
    const currentDate = new Date();
    const sql = `UPDATE users SET deleteAt = ? WHERE id = ?;`;

    mysql.connection.query(sql, [currentDate, user_id], (error, result) => {
        if (error) {
            // console.error(error);
            return callback(error, null);
        } else {
            console.log(`User with id ${user_id} has been deleted.`);
            return callback(null, result);
        }
    })
}*/
exports.deleteUser = (reqData) => {
    return new Promise((resolve, reject) => {
        console.log('delete in');
        devlog(`[Model] reqData.user_id = ${reqData.user_id}`);
        const {user_id} = reqData;
        const currentDate = new Date();
        const sql = `UPDATE users SET deleteAt = ? WHERE id = ?;`;

        mysql.connection.query(sql, [currentDate, user_id], (error, result) => {
            if (error) {
                reject(error);
            } else {
                console.log(`User with id ${user_id} has been deleted.`);
                resolve(error);
            }
        });
    });
}

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

// 이메일로 유저정보 가져오기
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

// 이메일 찾기
exports.findUserEmail = (reqData, callback) => {
    const { username, phonenum } = reqData;
    const sql = 'SELECT email FROM users WHERE username = ? AND phoneNumber = ?';
    mysql.connection.query(sql, [username, String(phonenum)], (error, results) => {
        if (error) {
            devlog(`findUserEmail - Query 에러`);
            return callback(error, null);
        }

        if (results.length === 0) {
            devlog(`findUserEmail - 찾은 사용자 없음`);
            return callback(null, null); // 사용자가 없을 경우 null을 반환합니다.
        }

        const user = results[0];
        return callback(null, user);
    });
}

// 이메일 찾기
exports.findUserEmail = (reqData, callback) => {
    const { username, phonenum } = reqData;
    const sql = 'SELECT email FROM users WHERE username = ? AND phoneNumber = ?';
    mysql.connection.query(sql, [username, String(phonenum)], (error, results) => {
        if (error) {
            devlog(`findUserEmail - Query 에러`);
            return callback(error, null);
        }

        if (results.length === 0) {
            devlog(`findUserEmail - 찾은 사용자 없음`);
            return callback(null, null); // 사용자가 없을 경우 null을 반환합니다.
        }

        const user = results[0];
        return callback(null, user);
    });
}

// 비밀번호 찾기
exports.checkUserPass = (reqData, callback) => {
    const { email, username, phonenum } = reqData;
    const sql = 'SELECT id FROM users WHERE email = ? AND username = ? AND phoneNumber = ?';
    mysql.connection.query(sql, [email, username, String(phonenum)], (error, results) => {
        if (error) {
            devlog(`findUserEmail - Query 에러`);
            return callback(error, null);
        }

        if (results.length === 0) {
            devlog(`findUserEmail - 찾은 사용자 없음`);
            return callback(null, null); // 사용자가 없을 경우 null을 반환합니다.
        }

        const user = results[0];
        return callback(null, user);
    });
}

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