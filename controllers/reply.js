const Reply = require('../models/reply');
const mysql = require('mysql');
const {devlog, errorlog} = require("../config/config");
const db = require("../config/database");
const replyUtils = require("../utils/replyUtils");

exports.writeReply = async (req, res) => {
    const { reply, post_id } = req.body;
    const { user_id } = req.session;

    if (!reply || reply === null) {
        return res.status(400).json({ error: 'Reply is required.' });
    }

    if (!user_id) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
        const user = await replyUtils.getUserById(user_id);

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        const reqData = {
            post_id: post_id,
            reply: reply,
            username: user.username,
            user_id: user_id,
        }

        const reply_id = await Reply.writeReply(reqData);
        return res.status(201).json({ message: `Upload post Success. Reply ID is ${reply_id}` });
    } catch(error) {
        errorlog(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

exports.getUserById = async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const user = await replyUtils.getUserById(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

exports.getReplyByPostId = async (req, res) => {
    const post_id = req.params.post_id;
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ code: 'invalid_offset' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ code: 'invalid_limit' });
    }

    try {
        const totalReplyResults = await new Promise((resolve, reject) => {
            const totalReplyQuery = `SELECT COUNT(*) AS totalReply FROM reply WHERE post_id = ?;`;
            db.connection.query(totalReplyQuery, post_id, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });

        const totalReply = totalReplyResults[0].totalReply;

        const reqData = {
            offset: offset,
            limit: limit,
            post_id: post_id,
        };

        const reply = await Reply.getReplyByPostId(reqData);

        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        return res.status(200).json({
            totalReply: totalReply,
            message: reply
        });
    } catch (error) {
        console.error('MySQL Error:', error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}


exports.getReplyByUserId = async (req, res) => {
    const { user_id } = req.session;
    devlog(`[Cont] reply / getReplyByUserId user_id = ${user_id}`);
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ code: 'invalid_offset' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ code: 'invalid_limit' });
    }

    if (!user_id) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
        const totalReplyResults = await new Promise((resolve, reject) => {
            const totalReplyQuery = `SELECT COUNT(*) AS totalReply FROM reply WHERE user_id = ?;`;
            db.connection.query(totalReplyQuery, user_id, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });

        const totalReply = totalReplyResults[0].totalReply;

        const reqData = {
            offset: offset,
            limit: limit,
            user_id: user_id,
        };

        const reply = await Reply.getReplyByUserId(reqData);

        if (!reply) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({
            totalReply: totalReply,
            message: reply
        });
    } catch (error) {
        console.error('MySQL Error:', error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

exports.deleteReplyById = async (req, res) => {
    const reply_id = req.params.reply_id;

    try {
        const reply = await Reply.deleteReplyById(reply_id);
        if (!reply) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(201).json({ message: `Reply(id=${reply_id}) deleted successfully.` });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ error: '내부 서버 오류' });
    }
}

exports.getDeletedReply = async (req, res) => {
    devlog(`[Cont] getDeletedReply in`);

    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ code: 'invalid_offset' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ code: 'invalid_limit' });
    }

    try {
        const totalDelReplyResults = await new Promise((resolve, reject) => {
            const totalDelReplyQuery = `SELECT COUNT(*) AS totalReply FROM delete_reply;`;
            db.connection.query(totalDelReplyQuery, (error, results) => {
                if (error) {
                    errorlog(error);
                    reject(error);
                }
                resolve(results);
            });
        });

        const totalReply = totalDelReplyResults[0].totalReply;

        const reqData = {
            offset: offset,
            limit: limit,
        };

        const reply = await Reply.getDeletedReply(reqData);
        devlog(`resData = ${reply}`);
        return res.status(200).json({ totalPosts: totalReply, message: reply });

    } catch (error) {
        errorlog(error);
        return res.status(500).json({message: '내부 서버 오류'});
    }
}

exports.editReply = async (req, res) => {
    const { reply } = req.body;
    const reply_id = req.params.reply;
    devlog(`[Cont] editReply req.session = ${req.session}`);
    devlog(`[Cont] editReply content = ${reply}`);
    devlog(`[Cont] editReply reply_id = ${reply_id}`);

    const reqData = {
        reply: reply,
        reply_id: reply_id
    }

    if (!reply || !reply_id) {
        return res.status(400).json({ error: 'Reply, Reply_id are required.' });
    }

    try {
        const editReply = await Reply.editReply(reqData);
        if (!editReply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        return res.status(201).json({ message: `Reply(id=${reply_id})'s content edited successfully.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '내부 서버 오류'});
    }
}