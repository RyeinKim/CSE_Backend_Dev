const express = require('express');
const adminController = require('../controllers/admin');
const isAdmin = require('../lib/auth').isAdmin;
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: 관리자 기능
 */

/**
 * @swagger
 * /admin/createUser:
 *   post:
 *     tags:
 *       - Admin
 *     description: "[관리자 기능] 유저 기본 정보 생성"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stNum:
 *                 type: string
 *                 description: "학번"
 *                 example: "20190001"
 *               username:
 *                 type: string
 *                 description: "이름"
 *                 example: "홍길동"
 *     responses:
 *       '201':
 *         description: "유저 기본 정보가 생성 완료되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "[Admin] 계정 생성 완료 / 유저ID = {user_id}"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 학번('stNum'), 유저이름('username')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: 학번"
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
router.post('/admin/createUser', isAdmin, adminController.createUser);

/**
 * @swagger
 * /admin/deleteUser/:user_id:
 *   delete:
 *     tags:
 *       - Admin
 *     description: "[관리자 기능] 계정 삭제하기"
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: "삭제할 계정의 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: "계정 정보가 삭제 완료되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보 삭제 완료 / 삭제 유저 ID = {user_id}"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 학번('user_id')이 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: user_id 파라미터"
 *       '404':
 *         description: "삭제하려는 계정 정보가 없을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보 없음"
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
router.delete('/admin/deleteUser/:user_id', isAdmin, adminController.deleteUserByUserId);

/**
 * @swagger
 * /admin/post/delete/:tableName/:post_id:
 *   delete:
 *     tags:
 *       - Admin
 *     description: "[관리자 기능] 게시글 강제삭제 하기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "삭제할 게시글이 있는 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: post_id
 *         in: path
 *         description: "삭제할 게시글의 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: "게시글이 삭제 완료되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글ID = {post_id} 삭제 완료"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: tableName 파라미터" # or "필수항목 누락: post_id 파라미터"
 *       '404':
 *         description: "삭제하려는 게시글이 없을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글이 존재하지 않음"
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
router.delete('/admin/posts/delete/:tableName/:post_id', isAdmin, adminController.adminDeletePostById);

/**
 * @swagger
 * /admin/reply/delete/:tableName/:reply_id:
 *   delete:
 *     tags:
 *       - Admin
 *     description: "[관리자 기능] 댓글 강제삭제 하기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "삭제할 댓글이 있는 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: reply_id
 *         in: path
 *         description: "삭제할 댓글의 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: "댓글이 삭제 완료되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "댓글ID = {reply_id} 삭제 완료"
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
 *       '404':
 *         description: "삭제하려는 댓글이 없을 때 반환됩니다."
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
router.delete('/admin/reply/delete/:tableName/:reply_id', isAdmin, adminController.adminDeleteReplyById);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     description: "[관리자 기능] 유저 목록 불러오기"
 *     parameters:
 *       - name: offset
 *         in: query
 *         description: "출력할 유저 목록의 시작 값"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: "불러올 유저의 개수"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       '200':
 *         description: "유저 목록을 성공적으로 불러왔을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 10
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: "유저 데이터 객체"
 *       '400':
 *         description: "잘못된 입력이 있을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "정상적인 offset 값 필요"
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
router.get('/admin/users', isAdmin, adminController.loadUsers);  // 유저 목록 불러오기 API

/**
 * @swagger
 * /post/recover/:tableName/:post_id:
 *   patch:
 *     tags:
 *       - Admin
 *     description: "[관리자 기능] 삭제된 게시글 복구 하기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "복구할 게시글이 있던 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: post_id
 *         in: path
 *         description: "복구할 게시글의 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: "게시글이 복구 완료되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글ID = 1 복구 완료"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 게시판이름('tableName'), 게시글ID('post_id')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: tableName 파라미터"
 *       '404':
 *         description: "복구하려는 게시글이 없을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글이 존재하지 않음"
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
router.patch('/posts/recover/:tableName/:post_id', isAdmin, adminController.recoverPostByPostId);

/**
 * @swagger
 * /reply/recover/:tableName/:reply_id:
 *   patch:
 *     tags:
 *       - Admin
 *     description: "[관리자 기능] 삭제된 댓글 복구 하기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "복구할 댓글이 있던 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: reply_id
 *         in: path
 *         description: "복구할 댓글의 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: "댓글이 복구 완료되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "댓글ID = 1 복구 완료"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 게시판이름('tableName'), 댓글ID('reply_id')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: reply_id 파라미터"
 *       '404':
 *         description: "복구하려는 댓글이 없을 때 반환됩니다."
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
router.patch('/reply/recover/:tableName/:reply_id', isAdmin, adminController.recoverReplyById);

/**
 * @swagger
 * /users/recover/:user_id:
 *   patch:
 *     tags:
 *       - Admin
 *     description: "[관리자 기능] 삭제된 계정 복구하기"
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: "복구할 계정의 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: "계정 정보가 복구 완료되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보 복구 완료 / 복구된 유저 ID = 1"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 계정ID('user_id')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: user_id 파라미터"
 *       '404':
 *         description: "복구하려는 계정 정보가 없을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "삭제된 유저 정보 없음"
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
router.patch('/users/recover/:user_id', isAdmin, adminController.recoverUserByUserId);

module.exports = router;