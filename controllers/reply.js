const Reply = require('../models/reply');
const mysql = require('mysql');
// const Post = require("./posts");
const {devlog} = require("../config/config");
const Post = require("../models/posts");

/*
exports.writeReply = (req, res) => {
    devlog('reply/wrtieReply in');

    const { reply, post_id } = req.body;

    const { user_id } = req.session; // 로그인한 사용자의 user_id
    devlog(`reply / req.session = ${req.session}`);
    devlog(`reply / req.session.user_id = ${user_id}`);

    if (!reply || reply === null) {
        return res.status(400).json({ error: 'Reply content is required.' });
    }

    if (!user_id) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    // user_id를 사용하여 사용자 정보 조회
    Post.getUserById(user_id, (error, user) => {
        console.log('reply / getUserById In');

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        const reqData = {
            post_id: mysql.escape(post_id),
            user_id: mysql.escape(user_id),
            username: mysql.escape(user.username), // 사용자 정보에서 username 사용
            reply: mysql.escape(reply),
        }

        Reply.writeReply(reqData, (error, reply_id) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred' });
            }

            return res.status(201).json({ message: `Upload reply Success. Reply ID is ${reply_id}` });
        });
    });
}*/

exports.writeReply = (req, res) => {
    const { reply, post_id } = req.body;
    const { user_id } = req.session; // 로그인한 사용자의 user_id

    if (!reply || reply === null) {
        return res.status(400).json({ error: 'Reply is required.' });
    }

    if (!user_id) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    // user_id를 사용하여 사용자 정보 조회
    Reply.getUserById(user_id, (error, user) => {
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

    Reply.getUserById(user_id, (error, user) => {
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
    const post_id = req.params.post_id;

    Reply.getReplyByPostId(post_id, (error, post) => {
        if (error) {
            return res.status(500).json({ error: '내부 서버 오류' });
        }

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json(post);
    })
}