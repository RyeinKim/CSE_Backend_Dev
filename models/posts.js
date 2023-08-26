const mysql = require('../config/database');

/**
 * 회원가입
 * 게시글쓰기
 * 유저ID로 유저이름 가져오기
 * 게시글ID로 게시글 불러오기
 */

// 회원가입
exports.registerUser = (reqData, callback) => {
    const sql =
        `INSERT INTO posts (author_id, title, author, content)
        VALUES (${reqData.author_id}, ${reqData.title}, ${reqData.author}, ${reqData.content});`
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
exports.writeUser = (reqData, callback) => {
    const sql =
        `INSERT INTO users (email, username, password, phoneNumber)
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

exports.getPostsAll = (callback) => {
    console.log("[Model] getPostsAll in");
    const sql = `SELECT * FROM posts;`;
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
    const query = 'SELECT * FROM posts WHERE post_id = ?';
    mysql.connection.query(query, post_id, (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length === 0) {
            return callback(null, null); // 게시글 없을 경우 null 반환
        }

        return callback(null, results);
    });
}

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