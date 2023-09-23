const mysql = require('../config/database');
const {devlog, errorlog} = require("../config/config");

// 댓글 쓰기
exports.writeReply = async (reqData) => {
    const { post_id, user_id, username, reply, tableName } = reqData;

    let sql;
    switch (tableName) {
        case 'free':

        case 'notice':

        case 'reply':
            sql = `INSERT INTO reply (post_id, user_id, username, reply)
                VALUES (?, ?, ?, ?);`;
            break;
    }

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [post_id, user_id, username, reply], (error, results) => {
                if (error)  {
                    errorlog(error);
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

    const { post_id, limit, offset } = reqData;
    const sql = 'SELECT * FROM reply WHERE post_id = ? LIMIT ? OFFSET ?;';

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [post_id, limit, offset], (error, results) => {
                if (error) {
                    errorlog(error);
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

exports.getReplyByUserId = async (reqData) => {
    devlog("Reply / getReplyByUserId in");
    const { user_id, offset, limit } = reqData;

    const sql = 'SELECT * FROM reply WHERE user_id = ? LIMIT ? OFFSET ?';

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [user_id, limit, offset], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }

                if (results.length === 0) {
                    return resolve(null);
                }

                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

// 게시글 ID 로 게시글 삭제하기
exports.deleteReplyById = async (reply_id) => {
    devlog('reply delete in');
    const currentDate = new Date();
    const sql = `UPDATE reply SET deletedAt = ? WHERE reply_id = ?;
                 INSERT INTO delete_reply (reply_id, post_id, user_id, username, reply, createdAt, deletedAt)
                 SELECT reply_id, post_id, user_id, username, reply, createdAt, ? as deletedAt
                 FROM reply
                 WHERE reply_id = ?;
                 DELETE FROM reply
                 WHERE reply_id = ?;`;

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [currentDate, reply_id, currentDate, reply_id, reply_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                const affectedRows = results[results.length - 1].affectedRows;
                if (affectedRows === 0) {
                    devlog(`deleteReplyById / affectedRows === 0`);
                    return resolve(null);
                }
                devlog(`Post id ${reply_id} has been deleted.`);
                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

exports.getDeletedReply = async (reqData) => {
    devlog("[Model] getDeletedReply in");
    const sql = `SELECT * FROM delete_reply LIMIT ${reqData.limit} OFFSET ${reqData.offset};`;

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

exports.editReply = async (reqData) => {
    devlog('[Model] Reply / editReply In');
    
    const { reply, reply_id } = reqData;
    devlog(`reply = ${reply} | reply_id = ${reply_id}`);

    const sql = `UPDATE reply SET reply = ? WHERE reply_id = ?;`;
    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [reply, reply_id], (error, results) => {
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