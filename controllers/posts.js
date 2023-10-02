const Post = require('../models/posts');
const mysql = require('mysql');
const { devlog, errorlog } = require("../config/config");
const db = require("../config/database");
const userUtils = require("../utils/userUtils");
const postsUtils = require("../utils/postsUtils");
const Reply = require("../models/reply");

/**
 * 게시글쓰기
 * 모든 게시글 불러오기
 * 유저 ID로 유저이름 가져오기
 * 게시글 ID로 게시글 불러오기
 * 게시글 ID로 게시글 삭제하기
 * 유저 ID로 게시글 목록 불러오기
 * 댓글로 게시글 불러오기
 */


// 게시글 쓰기
exports.writePost = async (req, res) => {
    const tableName = req.params.tableName;
    const { title, content } = req.body;
    const { user_id } = req.session;
    devlog(`[Cont] Post / writePost user_id = ${user_id}`);

    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }
    if (!title) {
        return res.status(400).json({ message: '필수항목 누락: 제목' });
    }
    if (!content) {
        return res.status(400).json({ message: '필수항목 누락: 내용' });
    }

    try {
        const user = await userUtils.getUserByUserId(user_id);

        if (!user) {
            return res.status(401).json({ message: '유저 정보 없음' });
        }

        const reqData = {
            title: title,
            content: content,
            author: user.username,
            author_id: user_id,
            tableName: tableName,
        };

        // 게시글 작성
        const writePost = await Post.writePost(reqData);
        const post_id = writePost.newPostId;
        return res.status(201).json({
            message: `게시글 업로드 완료 / 게시글ID = ${post_id}`,
            post_id: post_id,
        });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 모든 게시글 불러오기
exports.getPostsAll = async (req, res) => {
    const tableName = req.params.tableName;
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }
    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ message: '정상적인 offset 값 필요' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: '정상적인 limit 값 필요' });
    }

    try {
        const totalPosts = await postsUtils.getTotalPosts(tableName);
        devlog(`[Cont] posts / getPostByUserId totalPosts = ${totalPosts}`);

        const reqData = {
            offset: offset,
            limit: limit,
            tableName: tableName,
        };

        const posts = await Post.getPostsAll(reqData);
        devlog(`getPostsAll Controllers`);
        devlog(`resData = ${posts}`);
        return res.status(200).json({ totalPosts: totalPosts, message: posts });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 삭제된 게시글 불러오기
exports.getDeletedPosts = async (req, res) => {
    const tableName = req.params.tableName;
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }
    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ message: '정상적인 offset 값 필요' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: '정상적인 limit 값 필요' });
    }

    try {
        const totalPosts = await postsUtils.getTotalDelPosts(tableName);

        const reqData = {
            offset: offset,
            limit: limit,
            tableName: tableName,
        };

        const posts = await Post.getDeletedPosts(reqData);
        devlog(`getDeletedPosts Controllers`);
        devlog(`resData = ${posts}`);
        return res.status(200).json({ totalPosts: totalPosts, message: posts });

    } catch (error) {
        errorlog(error);
        return res.status(500).json({message: '내부 서버 오류'});
    }
}

// 게시글 ID로 게시글 삭제하기
exports.deletePostById = async (req, res) => {
    const { tableName, post_id } = req.params;
    const user_id = req.session.user_id;

    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }
    if (!post_id) {
        return res.status(400).json({ message: '필수항목 누락: post_id 파라미터' });
    }

    const reqData = {
        tableName: tableName,
        post_id: post_id,
        user_id: user_id,
    }

    try {
        const post = await Post.deletePostById(reqData);
        if (!post) {
            return res.status(404).json({ message: '게시글이 존재하지 않음' });
        }
        return res.status(201).json({ message: `게시글ID = ${post_id} 삭제 완료` });
    } catch (error) {
        errorlog(error);
        if (error.message === "해당 조건에 맞는 게시글이 없음") {
            return res.status(404).json({ message: '게시글이 존재하지 않음' });
        }
        if (error.message === "본인의 게시글이 아닙니다") {
            return res.status(403).json({ message: '본인의 게시글이 아닙니다' });
        }
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 유저 ID로 게시글 목록 불러오기
exports.getPostByUserId = async (req, res) => {
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);
    const { tableName, user_id } = req.params;

    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }
    if (!user_id) {
        return res.status(400).json({ message: '필수항목 누락: user_id 파라미터' });
    }
    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ message: '정상적인 offset 값 필요' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: '정상적인 limit 값 필요' });
    }

    const reqData = {
        user_id: user_id,
        tableName: tableName,
        offset: offset,
        limit: limit,
    };

    try {
        const totalPosts = await postsUtils.getTotalPostsByUserId(reqData);
        const posts = await Post.getPostByUserId(reqData);
        devlog(`[Cont] Posts / getPostByUserId posts = ${posts}`);

        if (!posts) {
            return res.status(404).json({ message: '게시글이 존재하지 않음' });
        }
        return res.status(200).json({ totalPosts: totalPosts, message: posts});
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 게시글 ID로 게시글 불러오기
exports.getPostByPostId = async (req, res) => {
    const { tableName, post_id } = req.params;

    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }
    if (!post_id) {
        return res.status(400).json({ message: '필수항목 누락: post_id 파라미터' });
    }

    const reqData = {
        tableName: tableName,
        post_id: post_id,
    }

    try {
        const post = await Post.getPostByPostId(reqData);
        if (!post) {
            return res.status(404).json({ message: '게시글이 존재하지 않음' });
        }
        return res.status(200).json(post);
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 댓글로 게시글 불러오기
exports.getPostByReply = async (req, res) => {
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);
    const user_id = req.session.user_id;

    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ message: '정상적인 offset 값 필요' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: '정상적인 limit 값 필요' });
    }

    const reqData = {
        user_id: user_id,
        offset: offset,
        limit: limit,
    };

    try {
        const totalPosts = await postsUtils.getTotalPostsByReply(user_id);
        const posts = await Post.getPostByReply(reqData);
        devlog(`[Cont] Posts / getPostByUserId posts = ${posts}`);

        if (!posts) {
            return res.status(404).json({ message: '게시글이 존재하지 않음' });
        }
        return res.status(200).json({ totalPosts: totalPosts, message: posts});
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 게시글 ID로 게시글 수정하기
exports.editPostByPostId = async (req, res) => {
    const { title, content } = req.body;
    const { post_id, tableName } = req.params;
    const user_id = req.session.user_id;

    devlog(`[Cont] editPostByPostId req.session = ${req.session}`);

    if (!title) {
        return res.status(400).json({ message: '필수항목 누락: reply' });
    }
    if (!content) {
        return res.status(400).json({ message: '필수항목 누락: content' });
    }
    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }
    if (!post_id) {
        return res.status(400).json({ message: '필수항목 누락: post_id 파라미터' });
    }

    const reqData = {
        title: title,
        content: content,
        post_id: post_id,
        tableName: tableName,
        user_id: user_id,
    }

    try {
        const editPost = await Post.editPostByPostId(reqData);
        if (!editPost) {
            return res.status(404).json({ message: '게시글이 존재하지 않음' });
        }
        return res.status(201).json({ message: `게시글ID = ${post_id} 내용 수정 완료` });
    } catch (error) {
        errorlog(error);
        if (error.message === "해당 조건에 맞는 게시글이 없음") {
            return res.status(404).json({ message: '게시글이 존재하지 않음' });
        }
        if (error.message === "본인의 게시글이 아닙니다") {
            return res.status(403).json({ message: '본인의 게시글이 아닙니다' });
        }
        return res.status(500).json({ message: '내부 서버 오류'});
    }
}