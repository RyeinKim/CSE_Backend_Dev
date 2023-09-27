// 게시글 ID 로 게시글 삭제하기
const {devlog} = require("../config/config");
const mysql = require('../config/database');

exports.deletePostById = async (reqData) => {
    devlog('post delete in');
    const { tableName, post_id, user_id } = reqData;
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
            mysql.connection.query(sql, [currentDate, post_id, currentDate, post_id, post_id], (error, results) => {
                if (error) {
                    errorlog(error);
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