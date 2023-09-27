// 게시글 ID 로 게시글 삭제하기
exports.deleteReplyById = async (reqData) => {
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
            mysql.connection.query(sql, [currentDate, reply_id, currentDate, reply_id, reply_id], (error, results) => {
                if (error) {
                    errorlog(error);
                    return reject(error);
                }
                const affectedRows = results[results.length - 1].affectedRows;
                if (affectedRows === 0) {
                    devlog(`deleteReplyById / affectedRows === 0`);
                    return resolve(null);
                }
                devlog(`Post id ${reply_id} has been deleted.`);
                return resolve(results);
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
}