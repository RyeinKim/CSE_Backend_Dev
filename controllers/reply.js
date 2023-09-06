const Reply = require('../models/reply');
const mysql = require('mysql');
const Post = require("./posts");

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
    const { content } = req.body;
    const { user_id } = req.session; // 로그인한 사용자의 user_id

    if (!content || content === null) {
        return res.status(400).json({ error: 'Content is required.' });
    }

    if (!user_id) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    // user_id를 사용하여 사용자 정보 조회
    Post.getUserById(user_id, (error, user) => {
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
            content: mysql.escape(content),
        }

        Reply.writeReply(reqData, (error, post_id) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred' });
            }

            return res.status(201).json({ message: `Upload post Success. Post ID is ${post_id}` });
        });
    });
}