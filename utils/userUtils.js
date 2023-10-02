const mysql = require("../config/database");
const {devlog, errorlog} = require("../config/config");
const db = require("../config/database");

exports.changeUserPass = async (reqData) => {
    const { email, username, phonenum, newPass } = reqData;
    const sql = 'UPDATE users SET password = ? WHERE email = ? AND username = ? AND phoneNumber = ?';

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [String(newPass), email, username, String(phonenum)], (error, results) => {
                if (error) {
                    errorlog(error);
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
                    errorlog(error);
                    return reject(error);
                }
                if (results.length === 0) {
                    return resolve(null); // 사용자가 없을 경우 null을 반환합니다.
                }
                const user = results[0];
                return resolve(user);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

exports.getUserByUserId = async (user_id) => {
    const query = 'SELECT * FROM users WHERE id = ?';

    return new Promise((resolve, reject) => {
        mysql.connection.query(query, user_id, (error, results) => {
            if (error) {
                errorlog(error);
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

exports.getTotalUsers = async () => {
    const totalUsersQuery = `SELECT COUNT(*) AS totalusers FROM my_db.users WHERE deleteAt IS NULL;`;

    return new Promise((resolve, reject) => {
        db.connection.query(totalUsersQuery, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results[0].totalusers);
        });
    });
};