const mysql = require("../config/database");
const db = require("../config/database");
const {errorlog, devlog} = require("../config/config");

exports.getUserById = async (user_id) => {
    const query = 'SELECT * FROM users WHERE id = ?';

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(query, user_id, (error, results) => {
                if (error) {
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

exports.getTotalDelReply = async (tableName) => {
    let totalDelReplyQuery;
    switch (tableName) {
        case 'free':
            totalDelReplyQuery = `SELECT COUNT(*) AS totalReply FROM del_reply.del_reply_free;`;
            break;
        case 'notice':
            totalDelReplyQuery = `SELECT COUNT(*) AS totalReply FROM del_reply.del_reply_notice;`;
            break;
        case 'reply':
            totalDelReplyQuery = `SELECT COUNT(*) AS totalReply FROM del_reply.del_reply;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    return new Promise((resolve, reject) => {
        db.connection.query(totalDelReplyQuery, (error, results) => {
            if (error) {
                errorlog(error);
                reject(error);
            }
            resolve(results[0].totalReply);
        });
    });
};

exports.getTotalReplyByUserId = async (reqData) => {
    const { user_id, tableName } = reqData;
    let totalReplyQuery;
    switch (tableName) {
        case 'free':
            totalReplyQuery = `SELECT COUNT(*) AS totalReply FROM reply.reply_free WHERE user_id = ?;`;
            break;
        case 'notice':
            totalReplyQuery = `SELECT COUNT(*) AS totalReply FROM reply.reply_notice WHERE user_id = ?;`;
            break;
        case 'reply':
            totalReplyQuery = `SELECT COUNT(*) AS totalReply FROM reply.reply WHERE user_id = ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    return new Promise((resolve, reject) => {
        db.connection.query(totalReplyQuery, user_id, (error, results) => {
            if (error) {
                errorlog(error);
                return reject(error);
            }
            devlog(results[0].totalReply);
            resolve(results[0].totalReply);
        });
    });
};

exports.getTotalReplyByUserId = async (reqData) => {
    const { user_id, tableName } = reqData;
    let totalReplyQuery;
    switch (tableName) {
        case 'free':
            totalReplyQuery = `SELECT COUNT(*) AS totalReply FROM reply.reply_free WHERE user_id = ?;`;
            break;
        case 'notice':
            totalReplyQuery = `SELECT COUNT(*) AS totalReply FROM reply.reply_notice WHERE user_id = ?;`;
            break;
        case 'reply':
            totalReplyQuery = `SELECT COUNT(*) AS totalReply FROM reply.reply WHERE user_id = ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    return new Promise((resolve, reject) => {
        db.connection.query(totalReplyQuery, user_id, (error, results) => {
            if (error) {
                errorlog(error);
                return reject(error);
            }
            devlog(results[0].totalReply);
            resolve(results[0].totalReply);
        });
    });
};

exports.getTotalReplyByPostId = async (reqData) => {
    const { post_id, tableName } = reqData;
    let totalReplyQuery;
    switch (tableName) {
        case 'free':
            totalReplyQuery = `SELECT COUNT(*) AS totalReply FROM reply.reply_free WHERE post_id = ?;`;
            break;
        case 'notice':
            totalReplyQuery = `SELECT COUNT(*) AS totalReply FROM reply.reply_notice WHERE post_id = ?;`;
            break;
        case 'reply':
            totalReplyQuery = `SELECT COUNT(*) AS totalReply FROM reply.reply WHERE post_id = ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    return new Promise((resolve, reject) => {
        db.connection.query(totalReplyQuery, post_id, (error, results) => {
            if (error) {
                errorlog(error);
                return reject(error);
            }
            devlog(results[0].totalReply);
            resolve(results[0].totalReply);
        });
    });
};