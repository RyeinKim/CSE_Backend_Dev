const Reply = require('../models/reply');
const {devlog, errorlog} = require("../config/config");
const replyUtils = require("../utils/replyUtils");

exports.writeReply = async (req, res) => {
    const { tableName } = req.params;
    const { reply, post_id } = req.body;
    const { user_id, role } = req.session;

    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }
    if (!post_id) {
        return res.status(400).json({ message: '필수항목 누락: post_id' });
    }
    if (!reply) {
        return res.status(400).json({ message: '필수항목 누락: 댓글내용' });
    }

    if (tableName === 'apply' && (role === 'webmaster' || role === 'admin')) {
        return res.status(401).json({ message: '관리자만 사용 가능합니다!' });
    }

    try {
        const user = await replyUtils.getUserById(user_id);

        const reqData = {
            post_id: post_id,
            reply: reply,
            username: user.username,
            user_id: user_id,
            tableName: tableName,
        }

        const reply_id = await Reply.writeReply(reqData);
        return res.status(201).json({ message: `댓글 업로드 완료 / 댓글ID = ${reply_id}` });
    } catch(error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

exports.getUserById = async (req, res) => {
    const user_id = req.params.user_id;

    if (!user_id) {
        return res.status(400).json({ message: '필수항목 누락: user_id 파라미터' });
    }

    try {
        const user = await replyUtils.getUserById(user_id);

        if (!user) {
            return res.status(404).json({ message: '해당하는 유저 정보 없음' });
        }
        return res.status(200).json(user);
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

exports.getReplyByPostId = async (req, res) => {
    const { post_id, tableName } = req.params;
    const user_id = req.session.user_id;
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }
    if (!post_id) {
        return res.status(400).json({ message: '필수항목 누락: post_id 파라미터' });
    }
    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ message: '정상적인 offset 값 필요' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: '정상적인 limit 값 필요' });
    }

    const reqData = {
        offset: offset,
        limit: limit,
        user_id: user_id,
        post_id: post_id,
        tableName: tableName,
    };

    try {
        const totalReply = await replyUtils.getTotalReplyByPostId(reqData);
        const reply = await Reply.getReplyByPostId(reqData);

        if (!reply) {
            return res.status(404).json({ message: '댓글이 존재하지 않음' });
        }

        return res.status(200).json({
            totalReply: totalReply,
            message: reply
        });
    } catch (error) {
        errorlog('MySQL Error:', error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

exports.getReplyByUserId = async (req, res) => {
    const { user_id } = req.session;
    const { tableName } = req.params;
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    devlog(`[Cont] reply / getReplyByUserId user_id = ${user_id}`);

    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }
    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ message: '정상적인 offset 값 필요' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: '정상적인 limit 값 필요' });
    }

    const reqData = {
        offset: offset,
        limit: limit,
        user_id: user_id,
        tableName: tableName,
    };

    try {
        const totalReply = await replyUtils.getTotalReplyByUserId(reqData);
        const reply = await Reply.getReplyByUserId(reqData);

        if (!reply) {
            return res.status(404).json({ message: '댓글이 존재하지 않음' });
        }

        return res.status(200).json({
            totalReply: totalReply,
            message: reply
        });
    } catch (error) {
        errorlog('MySQL Error:', error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

exports.deleteReplyById = async (req, res) => {
    const { reply_id, tableName } = req.params;
    const user_id = req.session.user_id;

    if (!reply_id) {
        return res.status(400).json({ message: '필수항목 누락: reply_id 파라미터' });
    }
    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }

    const reqData = {
        reply_id: reply_id,
        tableName: tableName,
        user_id: user_id,
    };

    try {
        const reply = await Reply.deleteReplyById(reqData);
        if (!reply) {
            return res.status(404).json({ message: '댓글이 존재하지 않음' });
        }
        return res.status(201).json({ message: `댓글ID = ${reply_id} 삭제 완료` });
    } catch (error) {
        errorlog(error);
        if (error.message === "해당 조건에 맞는 댓글이 없음") {
            return res.status(404).json({ message: '댓글이 존재하지 않음' });
        }
        if (error.message === "본인의 댓글이 아닙니다") {
            return res.status(403).json({ message: '본인의 댓글이 아닙니다' });
        }
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

exports.getDeletedReply = async (req, res) => {
    devlog(`[Cont] getDeletedReply in`);
    const { tableName } = req.params;
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

    const reqData = {
        offset: offset,
        limit: limit,
        tableName: tableName,
    };

    try {
        const totalReply = await replyUtils.getTotalDelReply(tableName);
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
    const { reply_id, tableName } = req.params;
    const { user_id, role } = req.session;

    devlog(`[Cont] editReply req.session = ${req.session}`);
    devlog(`[Cont] editReply content = ${reply}`);
    devlog(`[Cont] editReply reply_id = ${reply_id}`);

    if (!reply) {
        return res.status(400).json({ message: '필수항목 누락: reply' });
    }
    if (!tableName) {
        return res.status(400).json({ message: '필수항목 누락: tableName 파라미터' });
    }
    if (!reply_id) {
        return res.status(400).json({ message: '필수항목 누락: reply_id 파라미터' });
    }

    if (tableName === 'apply' && (role === 'webmaster' || role === 'admin')) {
        return res.status(401).json({ message: '관리자만 사용 가능합니다!' });
    }

    const reqData = {
        reply: reply,
        reply_id: reply_id,
        tableName: tableName,
        user_id: user_id,
    }

    try {
        const editReply = await Reply.editReply(reqData);
        if (!editReply) {
            return res.status(404).json({ message: '댓글이 존재하지 않음' });
        }
        return res.status(201).json({ message: `댓글ID = ${reply_id} 내용 수정 완료` });
    } catch (error) {
        errorlog(error);
        if (error.message === "해당 조건에 맞는 댓글이 없음") {
            return res.status(404).json({ message: '댓글이 존재하지 않음' });
        }
        if (error.message === "본인의 댓글이 아닙니다") {
            return res.status(403).json({ message: '본인의 댓글이 아닙니다' });
        }
        return res.status(500).json({ message: '내부 서버 오류'});
    }
}