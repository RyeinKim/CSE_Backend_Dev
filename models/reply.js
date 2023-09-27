const mysql = require('../config/database');
const {devlog, errorlog} = require("../config/config");

// 댓글 쓰기
exports.writeReply = async (reqData) => {
    const { post_id, user_id, username, reply, tableName } = reqData;

    let sql;
    switch (tableName) {
        case 'free':
            sql = `INSERT INTO reply.reply_free (post_id, user_id, username, reply)
                VALUES (?, ?, ?, ?);`;
            break;
        case 'notice':
            sql = `INSERT INTO reply.reply_notice (post_id, user_id, username, reply)
                VALUES (?, ?, ?, ?);`;
            break;
        case 'reply':
            sql = `INSERT INTO reply.reply (post_id, user_id, username, reply)
                VALUES (?, ?, ?, ?);`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
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

    const { post_id, limit, offset, tableName } = reqData;

    let sql;
    switch (tableName) {
        case 'free':
            sql = 'SELECT * FROM reply.reply_free WHERE post_id = ? LIMIT ? OFFSET ?;';
            break;
        case 'notice':
            sql = 'SELECT * FROM reply.reply_notice WHERE post_id = ? LIMIT ? OFFSET ?;';
            break;
        case 'reply':
            sql = 'SELECT * FROM reply.reply WHERE post_id = ? LIMIT ? OFFSET ?;';
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [post_id, limit, offset], (error, results) => {
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

exports.getReplyByUserId = async (reqData) => {
    devlog("Reply / getReplyByUserId in");
    const { offset, limit, user_id, tableName } = reqData;

    let sql;
    switch (tableName) {
        case 'free':
            sql = 'SELECT * FROM reply.reply_free WHERE user_id = ? LIMIT ? OFFSET ?;';
            break;
        case 'notice':
            sql = 'SELECT * FROM reply.reply_notice WHERE user_id = ? LIMIT ? OFFSET ?;';
            break;
        case 'reply':
            sql = 'SELECT * FROM reply.reply WHERE user_id = ? LIMIT ? OFFSET ?;';
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [user_id, limit, offset], (error, results) => {
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

// 게시글 ID 로 게시글 삭제하기
exports.deleteReplyById = async (reqData) => {
    devlog('reply delete in');
    const { reply_id, tableName, user_id } = reqData;
    const currentDate = new Date();

    let sql;
    switch (tableName) {
        case 'free':
            sql = `UPDATE reply.reply_free SET deletedAt = ? WHERE reply_id = ? AND user_id = ?;
                 INSERT INTO del_reply.del_reply_free (reply_id, post_id, user_id, username, reply, createdAt, deletedAt)
                 SELECT reply_id, post_id, user_id, username, reply, createdAt, ? as deletedAt
                 FROM reply.reply_free
                 WHERE reply_id = ? AND user_id = ?;
                 DELETE FROM reply.reply_free
                 WHERE reply_id = ? AND user_id = ?;`;
            break;
        case 'notice':
            sql = `UPDATE reply SET deletedAt = ? WHERE reply_id = ? AND user_id = ?;
                 INSERT INTO del_reply.del_reply_notice (reply_id, post_id, user_id, username, reply, createdAt, deletedAt)
                 SELECT reply_id, post_id, user_id, username, reply, createdAt, ? as deletedAt
                 FROM reply.reply_notice
                 WHERE reply_id = ? AND user_id = ?;
                 DELETE FROM reply.reply_notice
                 WHERE reply_id = ? AND user_id = ?;`;
            break;
        case 'reply':
            sql = `UPDATE reply SET deletedAt = ? WHERE reply_id = ? AND user_id = ?;
                 INSERT INTO del_reply.del_reply (reply_id, post_id, user_id, username, reply, createdAt, deletedAt)
                 SELECT reply_id, post_id, user_id, username, reply, createdAt, ? as deletedAt
                 FROM reply.reply
                 WHERE reply_id = ? AND user_id = ?;
                 DELETE FROM reply.reply
                 WHERE reply_id = ? AND user_id = ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [currentDate, reply_id, user_id, currentDate, reply_id, user_id, reply_id, user_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                const affectedRows = results[results.length - 1].affectedRows;
                if (affectedRows === 0) {
                    const noDataError = new Error("해당 조건에 맞는 댓글이 없음");
                    return reject(noDataError);
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
    const { offset, limit, tableName } = reqData;

    let sql;
    switch (tableName) {
        case 'free':
            sql = `SELECT * FROM del_reply.del_reply_free LIMIT ? OFFSET ?;`;
            break;
        case 'notice':
            sql = `SELECT * FROM del_reply.del_reply_notice LIMIT ? OFFSET ?;`;
            break;
        case 'reply':
            sql = `SELECT * FROM del_reply.del_reply LIMIT ? OFFSET ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [limit, offset], (error, results) => {
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
    const { reply, reply_id, tableName } = reqData;
    devlog(`reply = ${reply} | reply_id = ${reply_id}`);

    let sql;
    switch (tableName) {
        case 'free':
            sql = `UPDATE reply.reply_free SET reply = ? WHERE reply_id = ?;`;
            break;
        case 'notice':
            sql = `UPDATE reply.reply_notice SET reply = ? WHERE reply_id = ?;`;
            break;
        case 'reply':
            sql = `UPDATE reply.reply SET reply = ? WHERE reply_id = ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [reply, reply_id], (error, results) => {
                if (error) {
                    errorlog(error);
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