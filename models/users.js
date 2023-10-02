const mysql = require('../config/database');
const { devlog, errorlog } = require("../config/config");

/**
 * 회원 정보 목록 조회
 * 회원 전화번호 업데이트
 * 회원 정보 삭제
 * 회원 로그인
 * 이메일로 유저정보 가져오기
 */



// 회원 전화번호 업데이트
exports.updateUser = async (reqData) => {
    console.log('update in');
    console.log(`req.session = `, reqData.session);
    const sql = `UPDATE users SET phoneNumber='${reqData.phoneNumber}' WHERE email='${reqData.email}';`;

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, (error, results) => {
                if (error) {
                    return reject(error);
                }
                if (results.affectedRows === 0) {
                    return reject(new Error('No rows updated')); // 업데이트된 행이 없을 경우
                }
                resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}


// 회원 정보 삭제 (로그인 된 계정)
exports.deleteUser = async (user_id) => {
    console.log('delete in');
    devlog(`[Model] reqData.user_id = ${user_id}`);
    const currentDate = new Date();
    const sql = `UPDATE users SET deleteAt = ? WHERE id = ?;`;

    try {
        const result = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [currentDate, user_id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.affectedRows === 0) {
                    return resolve(null); // 삭제된 사용자를 찾을 수 없을 때 null을 반환
                }
                devlog(`User with id ${user_id} has been deleted.`);
                resolve(result);
            });
        });
        return result;
    } catch (error) {
        throw error;
    }
}

// 회원 로그인
exports.loginUser = async (email) => {
    devlog(`[Model] users / loginUser`);
    const sql = 'SELECT * FROM users WHERE email = ?';

    try {
        const result = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [email], (error, result) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                resolve(result[0]);
            });
        });
        return result;
    } catch (error) {
        throw error;
    }
}

// 회원가입
exports.registerUser = async (reqData) => {
    const { stNum, email, username, password, phoneNumber } = reqData;

    const checkSql = `
        SELECT * FROM users WHERE email = ?;
    `;

    const sql = `
        UPDATE users
        SET email = ?, password = ?, phoneNumber = ?
        WHERE stNum = ? AND username = ? AND password IS NULL;
    `;

    try {
        // 이메일 중복 체크
        const existingUsers = await new Promise((resolve, reject) => {
            mysql.connection.query(checkSql, [email], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                resolve(results);
            });
        });

        if (existingUsers.length > 0) {
            throw new Error('중복되는 이메일');
        }

        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [email, password, phoneNumber, stNum, username],(error, results) => {
                if (error)  {
                    errorlog(error);
                    return reject(error);
                }

                if (results.affectedRows === 0) {
                    return reject(new Error('일치하는 계정 정보 없음'));
                }

                resolve(results);
            });
        })
        return results;
    } catch (error) {
        throw error;
    }
}
/*exports.registerUser = async (reqData) => {
    const { stNum, email, username, password, phoneNumber } = reqData;

    const sql = `
        INSERT INTO users (stNum, email, username, password, phoneNumber)
        VALUES (
            ?, ?, ?, ?, ?
        );
    `;

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [stNum, email, username, password, phoneNumber],(error, results) => {
                if (error)  {
                    errorlog(error);
                    return reject(error);
                }
                resolve(results.insertId);
            });
        })
        return results;
    } catch (error) {
        throw error;
    }
}*/

// 이메일 찾기
exports.findUserEmail = async (reqData) => {
    const { username, phonenum } = reqData;
    const sql = 'SELECT email FROM users WHERE username = ? AND phoneNumber = ?';

    try {
        const user = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [username, String(phonenum)], (error, results) => {
                if (error) {
                    devlog(`findUserEmail - Query 에러`);
                    return reject(error);
                }
                if (results.length === 0) {
                    devlog(`findUserEmail - 찾은 사용자 없음`);
                    return resolve(null);
                }
                const user = results[0];
                return resolve(user);
            });
        })
        return user;
    } catch (error) {
        throw error;
    }
}

// 비밀번호 찾기
exports.checkUserPass = async (reqData) => {
    return new Promise((resolve, reject) => {
        const { email, username, phonenum } = reqData;
        const sql = 'SELECT id FROM users WHERE email = ? AND username = ? AND phoneNumber = ?';

        mysql.connection.query(sql, [email, username, String(phonenum)], (error, results) => {
            if (error) {
                devlog(`findUserEmail - Query 에러`);
                return reject(error);
            }
            if (results.length === 0) {
                devlog(`findUserEmail - 찾은 사용자 없음`);
                return resolve(null);
            }
            const user = results[0];
            devlog(`user = ${results[0]}`);
            return resolve(user);
        });
    })
}

// 유저ID로 유저이름 가져오기 (API)
exports.getUserById = async (user_id) => {
    const query = 'SELECT * FROM users WHERE id = ?';

    return new Promise((resolve, reject) => {
        mysql.connection.query(query, user_id, (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.length === 0) {
                return resolve(null);
            }
            devlog(`results = ${results}`);
            devlog(`results[0] = ${results[0]}`);
            const user = results[0];
            return resolve(user);
        });
    });
}