const express = require('express');
const replyController = require('../controllers/reply');
const isLoggedIn = require('../lib/auth').isLoggedIn;

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reply
 *     description: 댓글 관련 기능
 */

/**
 * @swagger
 * /posts/reply/:tableName:
 *   post:
 *     tags:
 *       - Reply
 *     description: "새로운 댓글 작성"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "댓글이 작성될 게시글이 존재하는 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reply:
 *                 type: string
 *                 description: "댓글 내용"
 *                 example: "이것은 내용입니다. 본분 내용을 작성합니다."
 *               post_id:
 *                 type: integer
 *                 description: "댓글이 작성될 게시글 ID"
 *                 example: 1
 *     responses:
 *       '201':
 *         description: "새로운 댓글이 생성 완료되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "댓글 업로드 완료 / 댓글ID = 1"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: tableName 파라미터"
 *       '500':
 *         description: "내부 서버 오류가 발생했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "내부 서버 오류"
 */
router.post('/reply/write/:tableName', isLoggedIn, replyController.writeReply);  // 댓글 쓰기 API

/**
 * @swagger
 * /reply/:tableName/:post_id:
 *   get:
 *     tags:
 *       - Reply
 *     description: "게시글ID로 해당 게시글에 있는 댓글 모두 불러오기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "댓글을 불러올 게시글이 존재하는 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: post_id
 *         in: path
 *         description: "댓글을 불러올 게시글 ID"
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: "출력할 댓글 시작 값"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: "불러올 댓글의 개수"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       '200':
 *         description: "요청된 ID의 게시글의 댓글을 모두 불러왔을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalReply:
 *                   type: integer
 *                   example: 10
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: "댓글 내용"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: tableName 파라미터"
 *       '404':
 *         description: "게시글에 댓글이 존재하지 않을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "댓글이 존재하지 않음"
 *       '500':
 *         description: "내부 서버 오류가 발생했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "내부 서버 오류"
 */
router.get('/reply/:tableName/:post_id', isLoggedIn, replyController.getReplyByPostId);  // 게시글 ID 로 게시글 불러오기 API

/**
 * @swagger
 * /reply/:tableName/user/:user_id:
 *   get:
 *     tags:
 *       - Reply
 *     description: "유저ID로 해당 유저가 작성한 댓글 모두 불러오기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "댓글을 불러올 게시글이 존재하는 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: user_id
 *         in: path
 *         description: "불러올 댓글의 작성자 ID"
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: "출력할 댓글 시작 값"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: "불러올 댓글의 개수"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       '200':
 *         description: "요청된 ID의 유저가 작성한 댓글을 모두 불러왔을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalReply:
 *                   type: integer
 *                   example: 10
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: "댓글 내용"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: tableName 파라미터"
 *       '404':
 *         description: "해당 유저가 작성한 댓글이 존재하지 않을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "댓글이 존재하지 않음"
 *       '500':
 *         description: "내부 서버 오류가 발생했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "내부 서버 오류"
 */
router.get('/reply/:tableName/user/:user_id', isLoggedIn, replyController.getReplyByUserId);  // 유저 ID 로 게시글 불러오기 API

/**
 * @swagger
 * /reply/delete/:tableName/:reply_id:
 *   delete:
 *     tags:
 *       - Reply
 *     description: "댓글ID로 댓글 삭제하기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "삭제할 댓글이 존재하는 게시글의 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: reply_id
 *         in: path
 *         description: "삭제할 댓글 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: "요청된 ID의 댓글을 삭제 완료했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "댓글ID = 123 삭제 완료"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: reply_id 파라미터"
 *       '403':
 *         description: "삭제할 댓글이 자신의 댓글이 아닐 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "본인의 댓글이 아닙니다"
 *       '404':
 *         description: "삭제할 댓글 존재하지 않을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "댓글이 존재하지 않음"
 *       '500':
 *         description: "내부 서버 오류가 발생했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "내부 서버 오류"
 */
router.delete('/reply/delete/:tableName/:reply_id', isLoggedIn, replyController.deleteReplyById);

/**
 * @swagger
 * /delReply/:tableName:
 *   get:
 *     tags:
 *       - Reply
 *     description: "삭제된 댓글 모두 불러오기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "삭제된 댓글이 있던 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: offset
 *         in: query
 *         description: "출력할 댓글 시작 값"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: "불러올 댓글 개수"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       '200':
 *         description: "선택한 게시판의 모든 삭제된 댓글을 불러왔을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPosts:
 *                   type: integer
 *                   example: 10
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: "삭제된 댓글 내용"
 *                   example: [{"reply_id": 1, "content": "댓글 내용"}]
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: tableName 파라미터"
 *       '500':
 *         description: "내부 서버 오류가 발생했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "내부 서버 오류"
 */
router.get('/delReply/:tableName', isLoggedIn, replyController.getDeletedReply);

/**
 * @swagger
 * /reply/edit/:tableName/:reply_id:
 *   patch:
 *     tags:
 *       - Reply
 *     description: "댓글 수정"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "수정할 댓글이 있는 게시글의 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: reply_id
 *         in: path
 *         description: "수정할 댓글 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reply:
 *                 type: string
 *                 description: "수정할 댓글 내용"
 *                 example: "수정 내용을 적어주세요."
 *     responses:
 *       '201':
 *         description: "선택한 댓글을 수정 완료했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "댓글ID = 123 내용 수정 완료"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: reply"
 *       '403':
 *         description: "수정할 댓글이 본인의 댓글이 아닐 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "본인의 댓글이 아닙니다"
 *       '404':
 *         description: "수정할 댓글이 존재하지 않을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "댓글이 존재하지 않음"
 *       '500':
 *         description: "내부 서버 오류가 발생했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "내부 서버 오류"
 */
router.patch('/reply/edit/:tableName/:reply_id', isLoggedIn, replyController.editReply);

module.exports = router;