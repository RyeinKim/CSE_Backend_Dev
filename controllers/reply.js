const Reply = require('../models/reply');
const mysql = require('mysql');
const Post = require("./posts");
const {devlog} = require("../config/config");

/**
 * 회원가입
 * 게시글쓰기
 * 유저 ID로 유저이름 가져오기
 * 모든 게시글 불러오기
 * 게시글 ID로 게시글 불러오기
 * 게시글 ID로 게시글 삭제하기
 *
 */

// 게시글쓰기
exports.writeReply = (req, res) => {
    devlog('reply/wrtieReply in');

    const { reply, post_id } = req.body;

    const user_id = req.session.user_id; // 로그인한 사용자의 user_id
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
}