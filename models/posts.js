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
        case 'qna':
            sql = `INSERT INTO posts.QABoard (author_id, title, author, content)
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
                return resolve({ newPostId: results.insertId });
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
        case 'qna':
            sql = `SELECT * FROM posts.QABoard LIMIT ? OFFSET ?;`;
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

    let checkOwnerSql, sql;
    switch(tableName) {
        case 'free':
            checkOwnerSql = `SELECT author_id FROM posts.FreeBoard WHERE post_id = ?`;
            sql = `UPDATE posts.FreeBoard SET deletedAt = ? WHERE post_id = ? AND author_id = ?;
                 INSERT INTO del_posts.del_free (post_id, author_id, author, title, content, createAt, deletedAt)
                 SELECT post_id, author_id, author, title, content, createAt, ? as deletedAt
                 FROM posts.FreeBoard
                 WHERE post_id = ? AND author_id = ?;
                 DELETE FROM posts.FreeBoard
                 WHERE post_id = ? AND author_id = ?;`;
            break;
        case 'notice':
            checkOwnerSql = `SELECT author_id FROM posts.NoticeBoard WHERE post_id = ?`;
            sql = `UPDATE posts.NoticeBoard SET deletedAt = ? WHERE post_id = ? AND author_id = ?;
                 INSERT INTO del_posts.del_notice (post_id, author_id, author, title, content, createAt, deletedAt)
                 SELECT post_id, author_id, author, title, content, createAt, ? as deletedAt
                 FROM posts.NoticeBoard
                 WHERE post_id = ? AND author_id = ?;
                 DELETE FROM posts.NoticeBoard
                 WHERE post_id = ? AND author_id = ?;`;
            break;
        case 'qna':
            checkOwnerSql = `SELECT author_id FROM posts.QABoard WHERE post_id = ?`;
            sql = `UPDATE posts.QABoard SET deletedAt = ? WHERE post_id = ? AND author_id = ?;
                 INSERT INTO del_posts.del_qa (post_id, author_id, author, title, content, createAt, deletedAt)
                 SELECT post_id, author_id, author, title, content, createAt, ? as deletedAt
                 FROM posts.QABoard
                 WHERE post_id = ? AND author_id = ?;
                 DELETE FROM posts.NoticeBoard
                 WHERE post_id = ? AND author_id = ?;`;
            break;
        case 'posts':
            checkOwnerSql = `SELECT author_id FROM posts.posts WHERE post_id = ?`;
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
        // First check ownership
        const ownerCheckResult = await new Promise((resolve, reject) => {
            mysql.connection.query(checkOwnerSql, [post_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                resolve(results);
            });
        });

        if (ownerCheckResult.length === 0) {
            throw new Error("해당 조건에 맞는 게시글이 없음");
        }

        if (ownerCheckResult[0].author_id !== user_id) {
            throw new Error("본인의 게시글이 아닙니다");
        }
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [currentDate, post_id, user_id, currentDate, post_id, user_id, post_id, user_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
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
        case 'qna':
            sql = `SELECT * FROM del_posts.QABoard LIMIT ? OFFSET ?;`;
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
            SELECT * FROM (
                SELECT 'free' AS board_type, FreeBoard.* FROM posts.FreeBoard WHERE author_id = ?
                UNION
                SELECT 'notice' AS board_type, NoticeBoard.* FROM posts.NoticeBoard WHERE author_id = ?
                UNION
                SELECT 'qna' AS board_type, QABoard.* FROM posts.QABoard WHERE author_id = ?
                UNION
                SELECT 'posts' AS board_type, posts.* FROM posts.posts WHERE author_id = ?
            ) AS results
            LIMIT ? OFFSET ?;
            `;
            params = [user_id, user_id, user_id, user_id, limit, offset];
            break;
        case 'free':
            sql = `SELECT 'free' AS board_type, * FROM posts.FreeBoard WHERE author_id = ? LIMIT ? OFFSET ?;`;
            params = [user_id, limit, offset];
            break;
        case 'notice':
            sql = `SELECT 'notice' AS board_type, * FROM posts.NoticeBoard WHERE author_id = ? LIMIT ? OFFSET ?;`;
            params = [user_id, limit, offset];
            break;
        case 'qna':
            sql = `SELECT 'qna' AS board_type, * FROM posts.QABoard WHERE author_id = ? LIMIT ? OFFSET ?;`;
            params = [user_id, limit, offset];
            break;
        case 'posts':
            sql = `SELECT 'posts' AS board_type, * FROM posts.posts WHERE author_id = ? LIMIT ? OFFSET ?;`;
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
        case 'qna':
            sql = 'SELECT * FROM posts.QABoard WHERE post_id = ?';
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

//
exports.getPostByReply = async (reqData) => {
    devlog("[Model] posts / getPostByReply in");
    const { user_id, limit, offset } = reqData;

    const sql = `
        SELECT * FROM (
            SELECT 'free' AS board_type, f.*
            FROM reply.reply_free rf
            JOIN posts.FreeBoard f ON rf.post_id = f.post_id
            WHERE rf.user_id = ?
            UNION ALL
            SELECT 'notice' AS board_type, n.*
            FROM reply.reply_notice rn
            JOIN posts.NoticeBoard n ON rn.post_id = n.post_id
            WHERE rn.user_id = ?
            UNION ALL
            SELECT 'qna' AS board_type, n.*
            FROM reply.reply_qa rn
            JOIN posts.QABoard n ON rn.post_id = n.post_id
            WHERE rn.user_id = ?
            UNION ALL
            SELECT 'posts' AS board_type, p.*
            FROM reply.reply r
            JOIN posts.posts p ON r.post_id = p.post_id
            WHERE r.user_id = ?
        ) AS combined_results
        LIMIT ? OFFSET ?;
    `;

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [user_id, user_id, user_id, user_id, limit, offset], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                devlog(results);
                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}

exports.editPostByPostId = async (reqData) => {
    devlog('[Model] Posts / editPostByPostId In');
    const { title, content, post_id, tableName, user_id } = reqData;

    let checkOwnerSql, sql;
    switch (tableName) {
        case 'free':
            checkOwnerSql = `SELECT author_id FROM posts.FreeBoard WHERE post_id = ?`;
            sql = `UPDATE posts.FreeBoard SET title = ?, content = ? WHERE post_id = ? AND author_id = ?;`;
            break;
        case 'notice':
            checkOwnerSql = `SELECT author_id FROM posts.NoticeBoard WHERE post_id = ?`;
            sql = `UPDATE posts.NoticeBoard SET title = ?, content = ? WHERE post_id = ? AND author_id = ?;`;
            break;
        case 'qna':
            checkOwnerSql = `SELECT author_id FROM posts.QABoard WHERE post_id = ?`;
            sql = `UPDATE posts.QABoard SET title = ?, content = ? WHERE post_id = ? AND author_id = ?;`;
            break;
        case 'posts':
            checkOwnerSql = `SELECT author_id FROM posts.posts WHERE post_id = ?`;
            sql = `UPDATE posts.posts SET title = ?, content = ? WHERE post_id = ? AND author_id = ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    try {
        // First check ownership
        const ownerCheckResult = await new Promise((resolve, reject) => {
            mysql.connection.query(checkOwnerSql, [post_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                resolve(results);
            });
        });

        if (ownerCheckResult.length === 0) {
            throw new Error("해당 조건에 맞는 게시글이 없음");
        }

        if (ownerCheckResult[0].author_id !== user_id) {
            throw new Error("본인의 게시글이 아닙니다");
        }

        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [title, content, post_id, user_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                if (results.affectedRows === 0) {
                    return reject(new Error('수정된 내용이 없음')); // 업데이트된 행이 없을 경우
                }
                resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}