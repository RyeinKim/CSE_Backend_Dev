const mysql = require('../config/database');
const { devlog } = require("../config/config");

/**
 * 회원 정보 목록 조회
 * 회원 전화번호 업데이트
 * 회원 정보 삭제
 * 회원 로그인
 * 이메일로 유저정보 가져오기
 */

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

exports.deleteUser = (reqData, callback) => {
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
}

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
*/
/*
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
 */

// 회원 정보 목록 조회
exports.loadUsers = async (reqData) => {
    devlog("[Model] loadUsers in");
    const sql = `SELECT * FROM users LIMIT ${reqData.limit} OFFSET ${reqData.offset};`;

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

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


// 회원 정보 삭제
exports.deleteUser = async (reqData) => {
    console.log('delete in');
    devlog(`[Model] reqData.user_id = ${reqData.user_id}`);
    const {user_id} = reqData;
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
exports.loginUser = async (reqData) => {
    devlog('login in');
    const reqPassword = reqData.password;
    devlog(`reqPassword = `, reqPassword);
    const sql = `SELECT * FROM users WHERE email = '${reqData.email}'`;

    try {
        const result = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (!result[0] || reqPassword !== result[0].password) {
                    return resolve(null);
                }
                devlog(JSON.stringify(result, null, 2));
                resolve(result[0].id);
            });
        });
        return result;
    } catch (error) {
        throw error;
    }
}
/*exports.loginUser = async (reqData) => {
    devlog('login in');
    const reqPassword = reqData.password;
    devlog(`reqPassword = `, reqPassword);
    const sql = `SELECT * FROM users WHERE email = '${reqData.email}'`;

    try {
        const result = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (!result[0] || reqPassword !== result[0].password) {
                    return resolve(null);
                }
                devlog(JSON.stringify(result, null, 2));
                resolve(result[0].id);
            });
        });
        return result;
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
                resolve(user);
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
                reject(error);
            } else {
                if (results.length === 0) {
                    devlog(`findUserEmail - 찾은 사용자 없음`);
                    resolve(null); // 사용자가 없을 경우 null을 반환합니다.
                } else {
                    const user = results[0];
                    devlog(`user = ${results[0]}`);
                    resolve(user);
                }
            }
        });
    })
}

/*exports.checkUserPass = (reqData, callback) => {
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

exports.checkUserPass = async (reqData) => {
    return new Promise((resolve, reject) => {
        const { email, username, phonenum } = reqData;
        const sql = 'SELECT id FROM users WHERE email = ? AND username = ? AND phoneNumber = ?';

        mysql.connection.query(sql, [email, username, String(phonenum)], (error, results) => {
            if (error) {
                devlog(`findUserEmail - Query 에러`);
                reject(error);
            } else {
                if (results.length === 0) {
                    devlog(`findUserEmail - 찾은 사용자 없음`);
                    resolve(null); // 사용자가 없을 경우 null을 반환합니다.
                } else {
                    const user = results[0];
                    devlog(`user = ${results[0]}`);
                    resolve(user);
                }
            }
        });
    })
}*/

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