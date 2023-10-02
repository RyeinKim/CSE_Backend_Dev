const db = require("../config/database");
const { errorlog, devlog } = require("../config/config");
const mysql = require("../config/database");

/**
 * 학생 정보 생성
 * 유저ID로 회원 정보 삭제
 * 게시글 ID로 게시글 강제 삭제
 * 댓글 ID로 댓글 강제 삭제
 */

// 학생 정보 생성 (회원가입 전)
exports.createUser = async(reqData) => {
    const { stNum, username } = reqData;

    const sql =
        `INSERT INTO users (stNum, username)
        VALUES (
            ?, ?
        );`

    try {
        const results = await new Promise((resolve, reject) => {
            db.connection.query(sql, [stNum, username],(error, results) => {
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
}

// 유저ID로 회원 정보 삭제
exports.deleteUserByUserId = async (user_id) => {
    devlog(`[Model] admin / deleteUserByUserId`);

    const currentDate = new Date();
    const sql = `UPDATE users SET deleteAt = ? WHERE id = ?;`;

    try {
        const result = await new Promise((resolve, reject) => {
            db.connection.query(sql, [currentDate, user_id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                devlog(`User with id ${user_id} has been deleted.`);
                return resolve(result);
            });
        });
        return result;
    } catch (error) {
        throw error;
    }
}

// 게시글 ID로 게시글 강제 삭제
exports.adminDeletePostById = async (reqData) => {
    devlog('post delete in');
    const { tableName, post_id } = reqData;
    const currentDate = new Date();

    let sql;
    switch(tableName) {
        case 'free':
            sql = `UPDATE posts.FreeBoard SET deletedAt = ? WHERE post_id = ?;
                 INSERT INTO del_posts.del_free (post_id, author_id, author, title, content, createAt, deletedAt)
                 SELECT post_id, author_id, author, title, content, createAt, ? as deletedAt
                 FROM posts.FreeBoard
                 WHERE post_id = ?;
                 DELETE FROM posts.FreeBoard
                 WHERE post_id = ?;`;
            break;
        case 'notice':
            sql = `UPDATE posts.NoticeBoard SET deletedAt = ? WHERE post_id = ?;
                 INSERT INTO del_posts.del_notice (post_id, author_id, author, title, content, createAt, deletedAt)
                 SELECT post_id, author_id, author, title, content, createAt, ? as deletedAt
                 FROM posts.NoticeBoard
                 WHERE post_id = ?;
                 DELETE FROM posts.NoticeBoard
                 WHERE post_id = ?;`;
            break;
        case 'posts':
            sql = `UPDATE posts.posts SET deletedAt = ? WHERE post_id = ?;
                 INSERT INTO del_posts.delete_posts (post_id, author_id, author, title, content, createAt, deletedAt)
                 SELECT post_id, author_id, author, title, content, createAt, ? as deletedAt
                 FROM posts.posts
                 WHERE post_id = ?;
                 DELETE FROM posts.posts
                 WHERE post_id = ?;`;
            break;
    }


    try {
        const results = await new Promise((resolve, reject) => {
            db.connection.query(sql, [currentDate, post_id, currentDate, post_id, post_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                const affectedRows = results[results.length - 1].affectedRows;
                if (affectedRows === 0) {
                    return resolve(null);
                }
                devlog(`게시글ID = ${post_id} 삭제 완료`);
                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

// 댓글 ID로 댓글 강제 삭제
exports.adminDeleteReplyById = async (reqData) => {
    devlog('reply delete in');
    const { reply_id, tableName } = reqData;
    const currentDate = new Date();

    let sql;
    switch (tableName) {
        case 'free':
            sql = `UPDATE reply.reply_free SET deletedAt = ? WHERE reply_id = ?;
                 INSERT INTO del_reply.del_reply_free (reply_id, post_id, user_id, username, reply, createdAt, deletedAt)
                 SELECT reply_id, post_id, user_id, username, reply, createdAt, ? as deletedAt
                 FROM reply.reply_free
                 WHERE reply_id = ?;
                 DELETE FROM reply.reply_free
                 WHERE reply_id = ?;`;
            break;
        case 'notice':
            sql = `UPDATE reply SET deletedAt = ? WHERE reply_id = ?;
                 INSERT INTO del_reply.del_reply_notice (reply_id, post_id, user_id, username, reply, createdAt, deletedAt)
                 SELECT reply_id, post_id, user_id, username, reply, createdAt, ? as deletedAt
                 FROM reply.reply_notice
                 WHERE reply_id = ?;
                 DELETE FROM reply.reply_notice
                 WHERE reply_id = ?;`;
            break;
        case 'reply':
            sql = `UPDATE reply SET deletedAt = ? WHERE reply_id = ?;
                 INSERT INTO del_reply.del_reply (reply_id, post_id, user_id, username, reply, createdAt, deletedAt)
                 SELECT reply_id, post_id, user_id, username, reply, createdAt, ? as deletedAt
                 FROM reply.reply
                 WHERE reply_id = ?;
                 DELETE FROM reply.reply
                 WHERE reply_id = ?;`;
            break;
    }

    try {
        const results = await new Promise((resolve, reject) => {
            db.connection.query(sql, [currentDate, reply_id, currentDate, reply_id, reply_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                const affectedRows = results[results.length - 1].affectedRows;
                if (affectedRows === 0) {
                    devlog(`deleteReplyById / affectedRows === 0`);
                    return resolve(null);
                }
                devlog(`댓글ID = ${reply_id} 삭제 완료`);
                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

// 회원 정보 목록 조회
exports.loadUsers = async (reqData) => {
    devlog("[Model] loadUsers in");
    const limit = parseInt(reqData.limit);
    const offset = parseInt(reqData.offset);

    const sql = `SELECT * FROM users WHERE deleteAt IS NULL LIMIT ? OFFSET ?;`;

    try {
        const results = await new Promise((resolve, reject) => {
            db.connection.query(sql, [limit, offset], (error, results) => {
                if (error) {
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

// 게시글 ID로 게시글 강제 삭제
exports.recoverPostByPostId = async (reqData) => {
    devlog('post recover in');
    const { tableName, post_id } = reqData;
    devlog(tableName, post_id)

    let sql;
    switch(tableName) {
        case 'free':
            sql = `
                INSERT INTO posts.FreeBoard (post_id, author_id, author, title, content, createAt)
                SELECT post_id, author_id, author, title, content, createAt
                FROM del_posts.del_free
                WHERE post_id = ?;
                DELETE FROM del_posts.del_free
                WHERE post_id = ?;
            `;
            break;
        case 'notice':
            sql = `
                INSERT INTO posts.NoticeBoard (post_id, author_id, author, title, content, createAt)
                SELECT post_id, author_id, author, title, content, createAt
                FROM del_posts.del_notice
                WHERE post_id = ?;
                DELETE FROM del_posts.del_notice
                WHERE post_id = ?;
            `;
            break;
        case 'posts':
            sql = `
                INSERT INTO posts.posts (post_id, author_id, author, title, content, createAt)
                SELECT post_id, author_id, author, title, content, createAt
                FROM del_posts.delete_posts
                WHERE post_id = ?;
                DELETE FROM del_posts.delete_posts
                WHERE post_id = ?;
            `;
            break;
    }


    try {
        const results = await new Promise((resolve, reject) => {
            db.connection.query(sql, [post_id, post_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                const affectedRows = results[results.length - 1].affectedRows;
                if (affectedRows === 0) {
                    return resolve(null);
                }
                devlog(`게시글ID = ${post_id} 복구 완료`);
                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

exports.recoverReplyById = async (reqData) => {
    devlog('reply delete in');
    const { reply_id, tableName } = reqData;

    let sql;
    switch (tableName) {
        case 'free':
            sql = `
                INSERT INTO reply.reply_free (reply_id, post_id, user_id, username, reply, createdAt)
                SELECT reply_id, post_id, user_id, username, reply, createdAt
                FROM del_reply.del_reply_free
                WHERE reply_id = ?;
                DELETE FROM del_reply.del_reply_free
                WHERE reply_id = ?;
            `;
            break;
        case 'notice':
            sql = `
                INSERT INTO reply.reply_notice (reply_id, post_id, user_id, username, reply, createdAt)
                SELECT reply_id, post_id, user_id, username, reply, createdAt
                FROM del_reply.del_reply_notice
                WHERE reply_id = ?;
                DELETE FROM del_reply.del_reply_notice
                WHERE reply_id = ?;
            `;
            break;
        case 'reply':
            sql = `
                INSERT INTO reply.reply (reply_id, post_id, user_id, username, reply, createdAt)
                SELECT reply_id, post_id, user_id, username, reply, createdAt
                FROM del_reply.del_reply
 k               WHERE reply_id = ?;
                DELETE FROM del_reply.del_reply
                WHERE reply_id = ?;
            `;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [reply_id, reply_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }

                const affectedRows = results[results.length - 1].affectedRows;
                if (affectedRows === 0) {
                    const noDataError = new Error("해당 조건에 맞는 댓글이 없음");
                    return reject(noDataError);
                }

                devlog(`댓글ID = ${reply_id} 복구 완료`);
                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

exports.recoverUserByUserId = async (user_id) => {
    devlog(`[Model] admin / recoverUserByUserId`);

    const sql = `UPDATE users SET deleteAt = NULL WHERE id = ? AND deleteAt IS NOT NULL;`;

    try {
        const result = await new Promise((resolve, reject) => {
            db.connection.query(sql, [user_id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                devlog(`유저ID = ${user_id} 복구 완료`);
                return resolve(result);
            });
        });
        return result;
    } catch (error) {
        throw error;
    }
}