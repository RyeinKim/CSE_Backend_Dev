const Reply = require('../models/reply');
const mysql = require('mysql');
const {devlog} = require("../config/config");
const db = require("../config/database");
const replyUtils = require("../utils/replyUtils");

/* Callback 함수 사용 소스
exports.writeReply = (req, res) => {
    const { reply, post_id } = req.body;
    const { user_id } = req.session;

    if (!reply || reply === null) {
        return res.status(400).json({ error: 'Reply is required.' });
    }

    if (!user_id) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    // user_id를 사용하여 사용자 정보 조회
    replyUtils.getUserById(user_id, (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        const reqData = {
            post_id: mysql.escape(post_id),
            reply: mysql.escape(reply),
            username: mysql.escape(user.username), // 사용자 정보에서 username 사용
            user_id: mysql.escape(user_id),
        }

        Reply.writeReply(reqData, (error, reply_id) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred' });
            }

            return res.status(201).json({ message: `Upload post Success. Reply ID is ${reply_id}` });
        });
    });
}

exports.getUserById = (req, res) => {
    const user_id = req.params.user_id;

    replyUtils.getUserById(user_id, (error, user) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    });
}

exports.getReplyByPostId = (req, res) => {
    // const { offset, limit } = req.query;
    const limit = parseInt(req.query.limit); // 문자열을 숫자로 변환
    let offset = parseInt(req.query.offset); // 문자열을 숫자로 변환

    const post_id = req.params.post_id;

    if (!offset || isNaN(offset) || offset < 0) {
        offset = 0; // offset이 0 또는 음수일 경우 0으로 설정
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ code: 'invalid_limit' });
    }

    const totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM reply;`;

    db.connection.query(totalPostsQuery, (error, results) => {
        if (error) {
            console.log(error);
            console.log('reply / First 500 error');
            return res.status(500).json({message: '내부 서버 오류'});
        }

        const totalPosts = results[0].totalPosts;

        const reqData = {
            post_id: post_id,
            offset: offset,
            limit: limit,
        };

        Reply.getReplyByPostId(reqData, (error, reply) => {
            if (error) {
                console.error('MySQL Error:', error); // MySQL 오류 로그 추가
                console.log('reply / Second 500 error');
                return res.status(500).json({ error: '내부 서버 오류' });
            }

            if (!reply) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(200).json({
                totalPosts: totalPosts,
                message: reply
            });
        })
    })
}
 */

exports.writeReply = (req, res) => {
    const { reply, post_id } = req.body;
    const { user_id } = req.session;

    if (!reply || reply === null) {
        return res.status(400).json({ error: 'Reply is required.' });
    }

    if (!user_id) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    // user_id를 사용하여 사용자 정보 조회
    replyUtils.getUserById(user_id, (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        const reqData = {
            post_id: mysql.escape(post_id),
            reply: mysql.escape(reply),
            username: mysql.escape(user.username), // 사용자 정보에서 username 사용
            user_id: mysql.escape(user_id),
        }

        Reply.writeReply(reqData, (error, reply_id) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred' });
            }

            return res.status(201).json({ message: `Upload post Success. Reply ID is ${reply_id}` });
        });
    });
}

exports.getUserById = (req, res) => {
    const user_id = req.params.user_id;

    replyUtils.getUserById(user_id, (error, user) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    });
}

exports.getReplyByPostId = async (req, res) => {
    const post_id = req.params.post_id;

    try {
        const totalPostsResults = await new Promise((resolve, reject) => {
            const totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM reply;`;
            db.connection.query(totalPostsQuery, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });

        const totalPosts = totalPostsResults[0].totalPosts;

        const reqData = {
            post_id: post_id,
        };

        const reply = await Reply.getReplyByPostId(reqData);

        if (!reply) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({
            totalPosts: totalPosts,
            message: reply
        });
    } catch (error) {
        console.error('MySQL Error:', error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}


exports.getReplyByUserId = async (req, res) => {
    const { user_id } = req.session;

    if (!user_id) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
        const totalPostsResults = await new Promise((resolve, reject) => {
            const totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM reply;`;
            db.connection.query(totalPostsQuery, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });

        const totalPosts = totalPostsResults[0].totalPosts;

        const reqData = {
            user_id: user_id,
        };

        const reply = await Reply.getReplyByUserId(reqData);

        if (!reply) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({
            totalPosts: totalPosts,
            message: reply
        });
    } catch (error) {
        console.error('MySQL Error:', error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

