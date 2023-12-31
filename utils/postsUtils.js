const db = require("../config/database");
const {errorlog} = require("../config/config");

exports.getTotalPosts = async (tableName) => {
    let totalPostsQuery;
    switch (tableName) {
        case 'free':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.FreeBoard;`;
            break;
        case 'notice':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.NoticeBoard;`;
            break;
        case 'qna':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.QABoard;`;
            break;
        case 'apply':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.ApplyBoard;`;
            break;
        case 'posts':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.posts;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    return new Promise((resolve, reject) => {
        db.connection.query(totalPostsQuery, (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results[0].totalPosts);
        });
    });
};

exports.getTotalPostsByUserId = async (reqData) => {
    const { user_id, tableName } = reqData;
    let totalPostsQuery;

    if (tableName === 'all') {
        const getFreeCount = () => new Promise((resolve, reject) => {
            const freeQuery = `SELECT COUNT(*) AS totalPosts FROM posts.FreeBoard WHERE author_id = ?;`;
            db.connection.query(freeQuery, user_id, (error, results) => {
                if (error) reject(error);
                else resolve(results[0].totalPosts);
            });
        });

        const getNoticeCount = () => new Promise((resolve, reject) => {
            const noticeQuery = `SELECT COUNT(*) AS totalPosts FROM posts.NoticeBoard WHERE author_id = ?;`;
            db.connection.query(noticeQuery, user_id, (error, results) => {
                if (error) reject(error);
                else resolve(results[0].totalPosts);
            });
        });

        const getQaCount = () => new Promise((resolve, reject) => {
            const QaQuery = `SELECT COUNT(*) AS totalPosts FROM posts.QABoard WHERE author_id = ?;`;
            db.connection.query(QaQuery, user_id, (error, results) => {
                if (error) reject(error);
                else resolve(results[0].totalPosts);
            });
        });

        const getPostsCount = () => new Promise((resolve, reject) => {
            const postsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.posts WHERE author_id = ?;`;
            db.connection.query(postsQuery, user_id, (error, results) => {
                if (error) reject(error);
                else resolve(results[0].totalPosts);
            });
        });

        try {
            const freeCount = await getFreeCount();
            const noticeCount = await getNoticeCount();
            const qaCount = await getQaCount();
            const postsCount = await getPostsCount();

            return freeCount + noticeCount + qaCount + postsCount;
        } catch (error) {
            errorlog(error);
            throw error;
        }
    }

    switch (tableName) {
        case 'free':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.FreeBoard WHERE author_id = ?;`;
            break;
        case 'notice':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.NoticeBoard WHERE author_id = ?;`;
            break;
        case 'qna':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.QABoard WHERE author_id = ?;`;
            break;
        case 'apply':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.ApplyBoard WHERE author_id = ?;`;
            break;
        case 'posts':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.posts WHERE author_id = ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    return new Promise((resolve, reject) => {
        db.connection.query(totalPostsQuery, user_id, (error, results) => {
            if (error) {
                errorlog(error);
                return reject(error);
            }
            resolve(results[0].totalPosts);
        });
    });
};

exports.getTotalDelPosts = async (tableName) => {
    let totalDelPostsQuery;
    switch(tableName) {
        case 'free':
            totalDelPostsQuery = `SELECT COUNT(*) AS totalPosts FROM del_posts.del_free;`;
            break;
        case 'notice':
            totalDelPostsQuery = `SELECT COUNT(*) AS totalPosts FROM del_posts.del_notice;`;
            break;
        case 'qna':
            totalDelPostsQuery = `SELECT COUNT(*) AS totalPosts FROM del_posts.del_qa;`;
            break;
        case 'apply':
            totalDelPostsQuery = `SELECT COUNT(*) AS totalPosts FROM del_posts.del_apply;`;
            break;
        case 'posts':
            totalDelPostsQuery = `SELECT COUNT(*) AS totalPosts FROM del_posts.delete_posts;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    return new Promise((resolve, reject) => {
        db.connection.query(totalDelPostsQuery, (error, results) => {
            if (error) {
                errorlog(error);
                reject(error);
            }
            resolve(results[0].totalPosts);
        });
    });
};

exports.getTotalPostsByReply = async (user_id) => {
    const totalPostsQuery = `
        SELECT COUNT(*) as totalPosts 
        FROM (
            SELECT 1
            FROM reply.reply_free rf
            JOIN posts.FreeBoard f ON rf.post_id = f.post_id
            WHERE rf.user_id = ?
            UNION ALL
            SELECT 1
            FROM reply.reply_notice rn
            JOIN posts.NoticeBoard n ON rn.post_id = n.post_id
            WHERE rn.user_id = ?
            UNION ALL
            SELECT 1
            FROM reply.reply_qa rn
            JOIN posts.QABoard n ON rn.post_id = n.post_id
            WHERE rn.user_id = ?
            UNION ALL
            SELECT 1
            FROM reply.reply r
            JOIN posts.posts p ON r.post_id = p.post_id
            WHERE r.user_id = ?
        ) as subquery;
    `;

    return new Promise((resolve, reject) => {
        db.connection.query(totalPostsQuery, [user_id, user_id, user_id, user_id], (error, results) => {
            if (error) {
                errorlog(error);
                return reject(error);
            }
            resolve(results[0].totalPosts);
        });
    });
};
exports.getTotalPostsByKeyword = async (reqData) => {
    const { keyword, tableName } = reqData;
    let keyWordWrap = `%${keyword}%`;
    let totalPostsQuery;

    switch (tableName) {
        case 'free':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.FreeBoard WHERE title LIKE ?;`;
            break;
        case 'notice':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.NoticeBoard WHERE title LIKE ?;`;
            break;
        case 'qna':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.QABoard WHERE title LIKE ?;`;
            break;
        case 'apply':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.ApplyBoard WHERE title LIKE ?;`;
            break;
        case 'posts':
            totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.posts WHERE title LIKE ?;`;
            break;
        default:
            throw new Error(`올바르지 않은 tableName: ${tableName}`);
    }

    return new Promise((resolve, reject) => {
        db.connection.query(totalPostsQuery, [keyWordWrap], (error, results) => {
            if (error) {
                errorlog(error);
                return reject(error);
            }
            resolve(results[0].totalPosts);
        });
    });
};