const mysql = require('../config/database');
const {devlog} = require("../config/config");

// 게시글쓰기
/*
exports.writeReply = (reqData, callback) => {
    console.log(`${reqData}`);
    console.log(`${reqData.post_id} | ${reqData.user_id} | ${reqData.username} | ${reqData.reply}`);

    const sql = `INSERT INTO reply (post_id, user_id, username, reply)
                VALUES (${reqData.post_id}, ${reqData.user_id}, ${reqData.username}, ${reqData.reply});`;
    mysql.connection.query(sql, (error, results) => {
        if (error)  {
            // 에러
            console.error(error);
            callback(error, null)
        } else {
            callback(null, results.insertId);
        }
    });
}*/
exports.writeReply = (reqData, callback) => {
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