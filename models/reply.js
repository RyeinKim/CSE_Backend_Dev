const mysql = require('../config/database');
const {devlog} = require("../config/config");

// 게시글쓰기
exports.writeReply = (reqData, callback) => {
    const sql = `INSERT INTO reply (post_id, user_id, username, reply)
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