const { devlog, errorlog } = require("../config/config");
const Admin = require('../models/admin');
const userUtils = require('../utils/userUtils');

/**
 * 학생 정보 생성
 * 유저ID로 회원 정보 삭제
 * 게시글 ID로 게시글 강제 삭제
 * 댓글 ID로 댓글 강제 삭제
 */

// 학생 정보 생성 (회원가입 전)
exports.createUser = async (req, res) => {
    const { stNum, username } = req.body;

    if (!stNum) {
        return res.status(400).json({ message: '필수항목 누락: 학번' });
    }
    if (!username) {
        return res.status(400).json({ message: '필수항목 누락: 유저이름' });
    }

    const reqData = {
        stNum: stNum,
        username: username,
    }

    try {
        const user_id = await Admin.createUser(reqData);
        devlog(`[Admin] 계정 생성 완료 / 유저ID = ${user_id}`);
        return res.status(201).json({ message: `[Admin] 계정 생성 완료 / 유저ID = ${user_id}` });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 유저ID로 회원 정보 삭제
exports.deleteUserByUserId = async (req, res) => {
    const user_id = req.params.user_id;

    if (!user_id) {
        return res.status(400).json({ message: '필수항목 누락: user_id 파라미터' });
    }

    try {
        const resData = await Admin.deleteUserByUserId(user_id);

        if (resData === null) {
            return res.status(404).json({ message: '유저 정보 없음' });
        }

        return res.status(201).json({ message: `유저 정보 삭제 완료 / 삭제 유저 ID = ${user_id}` });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 게시글 ID로 게시글 강제 삭제
exports.adminDeletePostById = async (req, res) => {
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
        const post = await Admin.adminDeletePostById(reqData);
        if (!post) {
            return res.status(404).json({ message: '게시글이 존재하지 않음' });
        }
        return res.status(201).json({ message: `게시글ID = ${post_id} 삭제 완료` });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 댓글 ID로 댓글 강제 삭제
exports.adminDeleteReplyById = async (req, res) => {
    const { reply_id, tableName } = req.params;

    if (!reply_id) {
        return res.status(400).json({ message: '필수항목 누락: reply_id 파라미터' });
    }
    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }

    const reqData = {
        reply_id: reply_id,
        tableName: tableName,
    };

    try {
        const reply = await Admin.adminDeleteReplyById(reqData);
        if (!reply) {
            return res.status(404).json({ message: '댓글이 존재하지 않음' });
        }
        return res.status(201).json({ message: `댓글ID = ${reply_id} 삭제 완료` });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 회원 정보 목록 조회
exports.loadUsers = async (req, res) => {
    const { offset, limit } = req.query;

    if (!offset || isNaN(offset) || offset < 0) {
        return res.status(400).json({ message: '정상적인 offset 값 필요' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: '정상적인 limit 값 필요' });
    }

    const reqData = {
        offset: offset,
        limit: limit,
    };

    try {
        const totalUsers = await userUtils.getTotalUsers();
        const resData = await Admin.loadUsers(reqData);
        devlog(`getUsers Controllers`);
        devlog(`resData = ${resData}`);
        return res.status(200).json({
            totalUsers: totalUsers,
            message: resData
        });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 게시글 ID로 게시글 복구
exports.recoverPostByPostId = async (req, res) => {
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
        const post = await Admin.recoverPostByPostId(reqData);
        if (!post) {
            return res.status(404).json({ message: '게시글이 존재하지 않음' });
        }
        return res.status(201).json({ message: `게시글ID = ${post_id} 복구 완료` });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

exports.recoverReplyById = async (req, res) => {
    const { reply_id, tableName } = req.params;

    if (!reply_id) {
        return res.status(400).json({ message: '필수항목 누락: reply_id 파라미터' });
    }
    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }

    const reqData = {
        reply_id: reply_id,
        tableName: tableName,
    };

    try {
        const reply = await Admin.recoverReplyById(reqData);
        if (!reply) {
            return res.status(404).json({ message: '댓글이 존재하지 않음' });
        }
        return res.status(201).json({ message: `댓글ID = ${reply_id} 복구 완료` });
    } catch (error) {
        errorlog(error);
        if (error.message === "해당 조건에 맞는 댓글이 없음") {
            return res.status(404).json({ message: '댓글이 존재하지 않음' });
        }
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

exports.recoverUserByUserId = async (req, res) => {
    const user_id = req.params.user_id;

    if (!user_id) {
        return res.status(400).json({ message: '필수항목 누락: user_id 파라미터' });
    }

    try {
        const resData = await Admin.recoverUserByUserId(user_id);

        if (resData === null) {
            return res.status(404).json({ message: '삭제된 유저 정보 없음' });
        }

        return res.status(201).json({ message: `유저 정보 복구 완료 / 복구된 유저 ID = ${user_id}` });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}