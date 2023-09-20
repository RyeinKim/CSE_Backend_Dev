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
                    console.error(error);
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
    const sql = `INSERT INTO posts (author_id, title, author, content)
                VALUES (${reqData.author_id}, ${reqData.title}, ${reqData.author}, ${reqData.content});`;

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, (error, results) => {
                if (error) {
                    // 에러
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

// 모든 게시글 불러오기
exports.getPostsAll = async (reqData) => {
    devlog("[Model] getPostsAll in");
    const sql = `SELECT * FROM posts LIMIT ? OFFSET ?;`;

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [reqData.limit, reqData.offset], (error, results) => {
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

// 게시글ID로 게시글 불러오기
exports.getPostById = async (post_id) => {
    const sql = 'SELECT * FROM posts WHERE post_id = ?';

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

// 게시글 ID 로 게시글 삭제하기
exports.deletePostById = async (post_id) => {
    devlog('post delete in');
    const currentDate = new Date();
    const sql = `UPDATE posts SET deletedAt = ? WHERE post_id = ?;
                 INSERT INTO delete_posts (post_id, author_id, author, title, content, createAt, deletedAt)
                 SELECT post_id, author_id, author, title, content, createAt, ? as deletedAt
                 FROM posts
                 WHERE post_id = ?;
                 DELETE FROM posts
                 WHERE post_id = ?;`;

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [currentDate, post_id, currentDate, post_id, post_id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                const affectedRows = results[results.length - 1].affectedRows;
                if (affectedRows === 0) {
                    return resolve(null);
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
    const sql = `SELECT * FROM delete_posts LIMIT ${reqData.limit} OFFSET ${reqData.offset};`;

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, (error, results) => {
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

    const { user_id, limit, offset } = reqData;
    const sql = `SELECT * FROM posts WHERE author_id = ? LIMIT ? OFFSET ?;`;

    try {
        const results = await new Promise((resolve, reject) => {
            mysql.connection.query(sql, [user_id, limit, offset], (error, results) => {
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

/*exports.deletePostById = (post_id, callback) => {
    console.log('post delete in');
    const sql = `UPDATE posts SET deletedAt = ? WHERE post_id = ?;`;
    const currentDate = new Date();

    mysql.connection.query(sql, [currentDate, post_id], (error, results) => {
        if (error) {
            // console.error(error);
            return callback(error, null);
        }
        if (results.length === 0) {
            return callback(null, null); // 게시글 없을 경우 null 반환
        }

        console.log(`Post id ${post_id} has been deleted.`);
        return callback(null, results);
    })
}*/

/*
// 회원 정보 추가
exports.createUser = (email, username, password, phoneNumber, callback) => {
    const sql = `INSERT INTO users (email, username, password, phoneNumber)
                  VALUES ('${email}', '${username}', '${password}', '${phoneNumber}');`;
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
};
*/

/* Callback 함수 사용 소스
exports.registerUser = (reqData, callback) => {
    const sql =
        `INSERT INTO users (email, username, password, pkoneNumber)
        VALUES (${reqData.email}, ${reqData.username}, ${reqData.password}, ${reqData.phoneNumber});`
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

// 게시글쓰기
exports.writePost = (reqData, callback) => {
    const sql = `INSERT INTO posts (author_id, title, author, content)
                VALUES (${reqData.author_id}, ${reqData.title}, ${reqData.author}, ${reqData.content});`;
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

// 유저ID로 유저이름 가져오기
exports.getUserById = (user_id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    mysql.connection.query(query, user_id, (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length === 0) {
            return callback(null, null); // 사용자가 없을 경우 null을 반환합니다.
        }

        const user = results[0];
        return callback(null, user);
    });
}

// 모든 게시글 불러오기
exports.getPostsAll = (reqData, callback) => {
    console.log("[Model] getPostsAll in");
    const sql = `SELECT * FROM posts LIMIT ${reqData.limit} OFFSET ${reqData.offset};`;
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

// 게시글ID로 게시글 불러오기
exports.getPostById = (post_id, callback) => {
    const sql = 'SELECT * FROM posts WHERE post_id = ?';
    mysql.connection.query(sql, post_id, (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length === 0) {
            return callback(null, null); // 게시글 없을 경우 null 반환
        }

        return callback(null, results);
    });
}

// 게시글 ID 로 게시글 삭제하기
exports.deletePostById = (post_id, callback) => {
    console.log('post delete in');
    const sql =
            `UPDATE posts SET deletedAt = ? WHERE post_id = ?;
            INSERT INTO delete_posts (post_id, author_id, author, title, content, createAt, deletedAt)
            SELECT post_id, author_id, author, title, content, createAt, deletedAt
            FROM posts
            WHERE post_id = ?;
            DELETE FROM posts
            WHERE post_id = ?;`;
    const currentDate = new Date();

    mysql.connection.query(sql, [currentDate, post_id, post_id, post_id], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        if (results.length === 0) {
            return callback(null, null); // 게시글 없을 경우 null 반환
        }

        console.log(`Post id ${post_id} has been deleted.`);
        return callback(null, results);
    })
}

// 삭제된 게시글 불러오기
exports.getDeletedPosts = (reqData, callback) => {
    console.log("[Model] getDeletedPosts in");
    const sql = `SELECT * FROM delete_posts LIMIT ${reqData.limit} OFFSET ${reqData.offset};`;
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}
 */