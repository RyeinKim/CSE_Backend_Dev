const mysql = require('../config/database');
const {devlog} = require("../config/config");

// 게시글쓰기
exports.writeReply = (reqData, callback) => {
    console.log(`${reqData}`);
    console.log(`${reqData.post_id} | ${reqData.user_id} | ${reqData.username} | ${reqData.reply}`);

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