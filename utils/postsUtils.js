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
            const freeQuery = `SELECT COUNT(*) AS totalPosts FROM del_posts.del_free WHERE author_id = ?;`;
            db.connection.query(freeQuery, user_id, (error, results) => {
                if (error) reject(error);
                else resolve(results[0].totalPosts);
            });
        });

        const getNoticeCount = () => new Promise((resolve, reject) => {
            const noticeQuery = `SELECT COUNT(*) AS totalPosts FROM del_posts.del_notice WHERE author_id = ?;`;
            db.connection.query(noticeQuery, user_id, (error, results) => {
                if (error) reject(error);
                else resolve(results[0].totalPosts);
            });
        });

        const getPostsCount = () => new Promise((resolve, reject) => {
            const postsQuery = `SELECT COUNT(*) AS totalPosts FROM del_posts.delete_posts WHERE author_id = ?;`;
            db.connection.query(postsQuery, user_id, (error, results) => {
                if (error) reject(error);
                else resolve(results[0].totalPosts);
            });
        });

        try {
            const freeCount = await getFreeCount();
            const noticeCount = await getNoticeCount();
            const postsCount = await getPostsCount();

            return freeCount + noticeCount + postsCount;
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