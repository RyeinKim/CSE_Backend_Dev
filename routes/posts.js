const express = require('express');
const postsController = require('../controllers/posts');
const isLoggedIn = require('../lib/auth').isLoggedIn;
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: 게시판 관련 기능
 */

/**
 * @swagger
 * /posts/write/:tableName:
 *   post:
 *     tags:
 *       - Posts
 *     description: "새로운 게시글 작성"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "게시글이 작성될 게시판 이름"
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
 *               title:
 *                 type: string
 *                 description: "게시글 제목"
 *                 example: "이것은 제목입니다."
 *               content:
 *                 type: string
 *                 description: "게시글 내용"
 *                 example: "이것은 내용입니다. 본분 내용을 작성합니다."
 *     responses:
 *       '201':
 *         description: "새로운 게시글이 생성 완료되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글 업로드 완료 / 게시글ID = 1"
 *                 post_id:
 *                   type: integer
 *                   example: 1
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 게시판이름('tableName'), 제목('title'), 내용('content')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: tableName 파라미터"
 *       '401':
 *         description: "작성자ID 가 확인되지 않았을 때 반환됩니다."
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
router.post('/posts/write/:tableName', isLoggedIn, postsController.writePost);  // 게시글 쓰기 API

/**
 * @swagger
 * /posts/board/:tableName:
 *   get:
 *     tags:
 *       - Posts
 *     description: "모든 게시글 불러오기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "불러올 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: offset
 *         in: query
 *         description: "출력할 게시글 시작 값"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: "불러올 게시글의 개수"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       '200':
 *         description: "선택한 게시판의 모든 게시물을 불러왔을 때 반환됩니다."
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
 *                     properties:
 *                       postId:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "게시글 제목"
 *                       content:
 *                         type: string
 *                         example: "게시글 내용"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 게시판이름('tabeName'), 시작값('offset'), 불러올 개수('limit')이(가) 필수항목 입니다."
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
router.get('/posts/board/:tableName', isLoggedIn, postsController.getPostsAll);  // 모든 게시글 불러오기 API

/**
 * @swagger
 * /posts/:tableName/:post_id:
 *   get:
 *     tags:
 *       - Posts
 *     description: "게시글ID로 게시글 정보 불러오기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "불러올 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: post_id
 *         in: path
 *         description: "불러올 게시글 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: "요청된 ID의 게시글을 불러왔을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "게시글 제목"
 *                 content:
 *                   type: string
 *                   example: "게시글 내용"
 *                 author:
 *                   type: string
 *                   example: "작성자 이름"
 *                 date:
 *                   type: string
 *                   example: "게시일"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 게시판이름('tableName'), 게시글ID('post_id')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: post_id 파라미터"
 *       '404':
 *         description: "게시글이 존재하지 않을 때 반환됩니다."
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
router.get('/posts/:tableName/:post_id', isLoggedIn, postsController.getPostByPostId);  // 게시글 ID 로 게시글 불러오기 API

/**
 * @swagger
 * /posts/:tableName/:user_id:
 *   get:
 *     tags:
 *       - Posts
 *     description: "작성자ID로 게시글 정보 불러오기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "불러올 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: user_id
 *         in: path
 *         description: "불러올 게시글의 작성자 ID"
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: "출력할 게시글 시작 값"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: "불러올 게시글의 개수"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       '200':
 *         description: "요청된 ID의 유저가 작성한 게시글을 불러왔을 때 반환됩니다."
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
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "게시글 제목"
 *                       content:
 *                         type: string
 *                         example: "게시글 내용"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 게시판이름('tableName'), 작성자ID('user_Id')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: user_id 파라미터"
 *       '404':
 *         description: "게시글이 존재하지 않을 때 반환됩니다."
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
router.get('/posts/byuser/:tableName/:user_id', isLoggedIn, postsController.getPostByUserId); // 유저 ID로 게시글 목록 불러오기

/**
 * @swagger
 * /posts/delete/:tableName/:post_id:
 *   delete:
 *     tags:
 *       - Posts
 *     description: "게시글ID로 게시글 삭제하기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "삭제할 게시글이 존재하는 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: post_id
 *         in: path
 *         description: "삭제할 게시글 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: "요청된 ID의 게시글을 삭제 완료했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글ID = 123 삭제 완료"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 게시판이름('tabeName'), 삭제할 게시글ID('post_id')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: post_id 파라미터"
 *       '403':
 *         description: "삭제할 게시글이 자신의 게시물이 아닐 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "본인의 게시글이 아닙니다"
 *       '404':
 *         description: "삭제할 게시글이 존재하지 않을 때 반환됩니다."
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
router.delete('/posts/delete/:tableName/:post_id', isLoggedIn, postsController.deletePostById);

/**
 * @swagger
 * /delposts/:tableName:
 *   get:
 *     tags:
 *       - Posts
 *     description: "삭제된 게시글 모두 불러오기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "불러올 게시글의 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: offset
 *         in: query
 *         description: "출력할 게시글 시작 값"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: "불러올 게시글의 개수"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       '200':
 *         description: "선택한 게시판의 모든 삭제된 게시물을 불러왔을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPosts:
 *                   type: integer
 *                   example: 120
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "삭제된 게시글1"
 *                       content:
 *                         type: string
 *                         example: "이 게시글은 삭제되었습니다."
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 게시판이름('tabeName'), 시작값('offset'), 불러올 개수('limit')이(가) 필수항목 입니다."
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
router.get('/delposts/:tableName', isLoggedIn, postsController.getDeletedPosts);  // 삭제된 게시글 불러오기 API

/**
 * @swagger
 * /posts/byreply:
 *   get:
 *     tags:
 *       - Posts
 *     description: "유저ID가 작성한 댓글이 존재하는 게시글 모두 불러오기"
 *     parameters:
 *       - name: offset
 *         in: query
 *         description: "출력할 게시글 시작 값"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: "불러올 게시글의 개수"
 *         required: true
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       '200':
 *         description: "요청된 ID의 게시글을 불러왔을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPosts:
 *                   type: integer
 *                   example: 120
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "게시글1"
 *                       content:
 *                         type: string
 *                         example: "이 게시글에는 유저가 댓글을 작성했습니다."
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 시작값('offset'), 불러올 개수('limit')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "정상적인 offset 값 필요"
 *       '404':
 *         description: "게시글이 존재하지 않을 때 반환됩니다."
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
router.get('/posts/byreply', isLoggedIn, postsController.getPostByReply); // 유저 ID로 게시글 목록 불러오기

/**
 * @swagger
 * /posts/edit/:tableName/:post_id:
 *   patch:
 *     tags:
 *       - Posts
 *     description: "게시글 수정"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "수정할 게시글이 존재하는 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: post_id
 *         in: path
 *         description: "수정할 게시글 ID"
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
 *               title:
 *                 type: string
 *                 description: "게시글 제목"
 *                 example: "이것은 제목입니다."
 *               content:
 *                 type: string
 *                 description: "게시글 내용"
 *                 example: "이것은 내용입니다. 본분 내용을 작성합니다."
 *     responses:
 *       '201':
 *         description: "게시글 수정이 완료되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글ID = 1 내용 수정 완료"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: title"
 *       '403':
 *         description: "수정할 게시글이 본인의 게시글이 아닐 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "본인의 게시글이 아닙니다"
 *       '404':
 *         description: "수정할 게시글이 존재하지 않을 때 반환됩니다."
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
router.patch('/posts/edit/:tableName/:post_id', isLoggedIn, postsController.editPostByPostId);

/**
 * @swagger
 * /posts/:tableName/:post_id:
 *   get:
 *     tags:
 *       - Posts
 *     description: "게시글ID로 게시글 정보 불러오기"
 *     parameters:
 *       - name: tableName
 *         in: path
 *         description: "불러올 게시판 이름"
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, free, notice, qna]
 *       - name: post_id
 *         in: path
 *         description: "불러올 게시글 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: "요청된 ID의 게시글을 불러왔을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "게시글 제목"
 *                 content:
 *                   type: string
 *                   example: "게시글 내용"
 *                 author:
 *                   type: string
 *                   example: "작성자 이름"
 *                 date:
 *                   type: string
 *                   example: "게시일"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 게시판이름('tableName'), 게시글ID('post_id')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: post_id 파라미터"
 *       '404':
 *         description: "게시글이 존재하지 않을 때 반환됩니다."
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
router.get('/posts/search/:tableName', isLoggedIn, postsController.searchPosts);  // 게시글 ID 로 게시글 불러오기 API

// router.get('/posts/:tableName/:id', isLoggedIn, postsController.getPostsById);

module.exports = router;