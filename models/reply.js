const mysql = require('../config/database');
const {devlog} = require("../config/config");

/* Callback 함수 사용 소스
exports.writeReply = (reqData, callback) => {
    const sql = `INSERT INTO reply (post_id, user_id, username, reply)
                VALUES (${reqData.post_id}, ${reqData.user_id}, ${reqData.username}, ${reqData.reply});`;
    mysql.connection.query(sql, (error, results) => {
        if (error)  {
            // 에러
            console.error(error);
            callback(error, null);
        } else {
            callback(null, results.insertId);
        }
    });
}

exports.getReplyByPostId = (reqData, callback) => {
    devlog("Reply / getReplyByPostId in");

    const { post_id, offset, limit } = reqData;
    const sql = 'SELECT * FROM reply WHERE post_id = ? LIMIT ? OFFSET ?';
    mysql.connection.query(sql, [post_id, limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length === 0) {
            return callback(null, null); // 게시글 없을 경우 null 반환
        }

        return callback(null, results);
    });
}
 */

// 게시글쓰기
exports.writeReply = async (reqData) => {
    const sql = `INSERT INTO reply (post_id, user_id, username, reply)
                VALUES (${reqData.post_id}, ${reqData.user_id}, ${reqData.username}, ${reqData.reply});`;
    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, (error, results) => {
                if (errorW)  {
                    console.error(error);
                    return reject(error);
                }
                return resolve(results.insertId);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }

}

exports.getReplyByPostId = async (reqData) => {
    devlog("Reply / getReplyByPostId in");

    const { post_id, offset, limit } = reqData;
    const sql = 'SELECT * FROM reply WHERE post_id = ? LIMIT ? OFFSET ?';

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [post_id, limit, offset], (error, results) => {
                if (error) {
                    return reject(error);
                }

                if (results.length === 0) {
                    return resolve(null); // 게시글 없을 경우 null 반환
                }

                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

exports.getReplyByUserId = (reqData, callback) => {
    devlog("Reply / getReplyByPostId in");

    const { post_id, offset, limit } = reqData;
    const sql = 'SELECT * FROM reply WHERE post_id = ? LIMIT ? OFFSET ?';
    mysql.connection.query(sql, [post_id, limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length === 0) {
            return callback(null, null); // 게시글 없을 경우 null 반환
        }

        return callback(null, results);
    });
}