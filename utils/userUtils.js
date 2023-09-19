const mysql = require("../config/database");
const {devlog} = require("../config/config");

/*exports.changeUserPass = (reqData, callback) => {
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
}*/

exports.changeUserPass = async (reqData) => {
    console.log("model IN!!!!!!!!!!!!!");
    const { email, username, phonenum, newPass } = reqData;
    const sql = 'UPDATE users SET password = ? WHERE email = ? AND username = ? AND phoneNumber = ?';

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [String(newPass), email, username, String(phonenum)], (error, results) => {
                if (error) {
                    devlog(`findUserEmail - Query 에러`);
                    return reject(error);
                }

                if (results.length === 0) {
                    devlog(`findUserEmail - 찾은 사용자 없음`);
                    return resolve(null);
                }

                // const user = results[0];
                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

exports.getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(query, [email], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length === 0) {
                        resolve(null); // 사용자가 없을 경우 null을 반환합니다.
                    } else {
                        const user = results[0];
                        resolve(user);
                    }
                }
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}
/*exports.getUserByEmail = (email, callback) => {
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
}*/

exports.getUserByUserId = async (user_id) => {
    const query = 'SELECT * FROM users WHERE id = ?';

    return new Promise((resolve, reject) => {
        mysql.connection.query(query, user_id, (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length === 0) {
                    resolve(null);
                } else {
                    devlog(`results = ${results}`);
                    devlog(`results[0] = ${results[0]}`);
                    const user = results[0];
                    resolve(user);
                }
            }
        });
    });
}
