const mysql = require('../config/database');
const {devlog, errorlog} = require("../config/config");

/**
 * 게시글쓰기
 * 유저ID로 유저이름 가져오기
 * 모든 게시글 불러오기
 * 게시글ID로 게시글 불러오기
 * 게시글 ID 로 게시글 삭제하기
 * 삭제된 게시글 불러오기
 * 유저 ID로 게시글 목록 불러오기
 */

// 회원가입
exports.registerUser = async (reqData) => {
    const sql =
        `INSERT INTO users (email, username, password, phoneNumber)
        VALUES (${reqData.email}, ${reqData.username}, ${reqData.password}, ${reqData.phoneNumber});`

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, (error, results) => {
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

// 게시글쓰기
exports.writePost = async (reqData) => {
    const { author_id, title, author, content, tableName } = reqData;
    let sql;
    switch (tableName) {
        case 'free':
            sql = `INSERT INTO posts.FreeBoard (author_id, title, author, content)
                VALUES (?, ?, ?, ?);`;
            break;
        case 'notice':
            sql = `INSERT INTO posts.NoticeBoard (author_id, title, author, content)
                VALUES (?, ?, ?, ?);`;
            break;
        case 'posts':
            sql = `INSERT INTO posts.posts (author_id, title, author, content)
                VALUES (?, ?, ?, ?);`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }


    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [author_id, title, author, content], (error, results) => {
                if (error) {
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

// 모든 게시글 불러오기
exports.getPostsAll = async (reqData) => {
    devlog("[Model] getPostsAll in");
    const { limit, offset, tableName } = reqData;

    let sql;
    switch (tableName) {
        case 'free':
            sql = `SELECT * FROM posts.FreeBoard LIMIT ? OFFSET ?;`;
            break;
        case 'notice':
            sql = `SELECT * FROM posts.NoticeBoard LIMIT ? OFFSET ?;`;
            break;
        case 'posts':
            sql = `SELECT * FROM posts.posts LIMIT ? OFFSET ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [limit, offset], (error, results) => {
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

// 게시글 ID 로 게시글 삭제하기
exports.deletePostById = async (reqData) => {
    devlog('post delete in');
    const { tableName, post_id, user_id } = reqData;
    const currentDate = new Date();

    let sql;
    switch(tableName) {
        case 'free':
            sql = `UPDATE posts.FreeBoard SET deletedAt = ? WHERE post_id = ? AND author_id = ?;
                 INSERT INTO del_posts.del_free (post_id, author_id, author, title, content, createAt, deletedAt)
                 SELECT post_id, author_id, author, title, content, createAt, ? as deletedAt
                 FROM posts.FreeBoard
                 WHERE post_id = ? AND author_id = ?;
                 DELETE FROM posts.FreeBoard
                 WHERE post_id = ? AND author_id = ?;`;
            break;
        case 'notice':
            sql = `UPDATE posts.NoticeBoard SET deletedAt = ? WHERE post_id = ? AND author_id = ?;
                 INSERT INTO del_posts.del_notice (post_id, author_id, author, title, content, createAt, deletedAt)
                 SELECT post_id, author_id, author, title, content, createAt, ? as deletedAt
                 FROM posts.NoticeBoard
                 WHERE post_id = ? AND author_id = ?;
                 DELETE FROM posts.NoticeBoard
                 WHERE post_id = ? AND author_id = ?;`;
            break;
        case 'posts':
            sql = `UPDATE posts.posts SET deletedAt = ? WHERE post_id = ? AND author_id = ?;
                 INSERT INTO del_posts.delete_posts (post_id, author_id, author, title, content, createAt, deletedAt)
                 SELECT post_id, author_id, author, title, content, createAt, ? as deletedAt
                 FROM posts.posts
                 WHERE post_id = ? AND author_id = ?;
                 DELETE FROM posts.posts
                 WHERE post_id = ? AND author_id = ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }


    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [currentDate, post_id, user_id, currentDate, post_id, user_id, post_id, user_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                const affectedRows = results[results.length - 1].affectedRows;
                if (affectedRows === 0) {
                    const noDataError = new Error("해당 조건에 맞는 게시글이 없음");
                    return reject(noDataError);
                }
                devlog(`Post id ${post_id} has been deleted.`);
                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

// 삭제된 게시글 불러오기
exports.getDeletedPosts = async (reqData) => {
    devlog("[Model] getDeletedPosts in");
    const { tableName, limit, offset } = reqData;

    let sql;
    switch(tableName) {
        case 'free':
            sql = `SELECT * FROM del_posts.del_free LIMIT ? OFFSET ?;`;
            break;
        case 'notice':
            sql = `SELECT * FROM del_posts.del_notice LIMIT ? OFFSET ?;`;
            break;
        case 'posts':
            sql = `SELECT * FROM del_posts.delete_posts LIMIT ? OFFSET ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql,[limit, offset], (error, results) => {
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

// 유저 ID로 게시글 목록 불러오기
exports.getPostByUserId = async (reqData) => {
    devlog("[Model] posts / getPostByUserId in");

    const { user_id, tableName, limit, offset } = reqData;

    let sql;
    let params = [];
    switch(tableName) {
        case 'all':
            sql = `
            (
                SELECT * FROM posts.FreeBoard WHERE author_id = ? 
                UNION 
                SELECT * FROM posts.NoticeBoard WHERE author_id = ?
                UNION
                SELECT * FROM posts.posts WHERE author_id = ?
            )
            LIMIT ? OFFSET ?;
            `;
            params = [user_id, user_id, user_id, limit, offset];
            break;
        case 'free':
            sql = `SELECT * FROM posts.FreeBoard WHERE author_id = ? LIMIT ? OFFSET ?;`;
            params = [user_id, limit, offset];
            break;
        case 'notice':
            sql = `SELECT * FROM posts.NoticeBoard WHERE author_id = ? LIMIT ? OFFSET ?;`;
            params = [user_id, limit, offset];
            break;
        case 'posts':
            sql = `SELECT * FROM posts.posts WHERE author_id = ? LIMIT ? OFFSET ?;`;
            params = [user_id, limit, offset];
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, params, (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                devlog(`[Model] Posts / getPostByUserId results = ${results}`);
                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

// 게시글ID로 게시글 불러오기
exports.getPostByPostId = async (reqData) => {
    devlog(`[Model] posts / getPostByPostId in`);
    const { tableName, post_id } = reqData;

    let sql;
    switch (tableName) {
        case 'free':
            sql = 'SELECT * FROM posts.FreeBoard WHERE post_id = ?';
            break;
        case 'notice':
            sql = 'SELECT * FROM posts.NoticeBoard WHERE post_id = ?';
            break;
        case 'posts':
            sql = 'SELECT * FROM posts.posts WHERE post_id = ?';
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    try {
        const results = await new Promise ((resolve, reject) => {
            mysql.connection.query(sql, post_id, (error, results) => {
                if (error) {
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