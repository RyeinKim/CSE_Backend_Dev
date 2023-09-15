const mysql = require("../config/database");

exports.getUserById = async (user_id) => {
    const query = 'SELECT * FROM users WHERE id = ?';

    try {
        const results = await new Promise((resolve, reject) => {
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
        })
    } catch (error) {

    }

}

/*
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
}*/
