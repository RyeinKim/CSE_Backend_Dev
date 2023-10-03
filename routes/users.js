const express = require('express');
const usersController = require('../controllers/users');
const isLoggedIn = require('../lib/auth').isLoggedIn;
const isDeletedUser = require('../lib/auth').isDeletedUser;
const isPassCheck = require('../lib/auth').isPassCheck;
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: 유저 관련 기능
 */

/**
 * @swagger
 * /users/logout:
 *   get:
 *     tags:
 *       - User
 *     description: "로그아웃 기능"
 *     responses:
 *       '200':
 *         description: "로그아웃이 성공했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그아웃 성공"
 *       '500':
 *         description: "내부 서버 오류가 발생했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그아웃 실패"
 */
router.get('/users/logout', isLoggedIn, usersController.logoutUser);  // 로그아웃 API

/**
 * @swagger
 * /users/check-auth:
 *   get:
 *     tags:
 *       - User
 *     description: "로그인 여부 확인"
 *     responses:
 *       '200':
 *         description: "로그인이 되어있는 상태일 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                   example: true
 *                 user_id:
 *                   type: string
 *                   example: "5"
 *                 role:
 *                   type: string
 *                   enum:
 *                     - user
 *                     - council
 *                     - admin
 *                     - webmaster
 *                   default: "user"
 *       '401':
 *         description: "로그인이 되어있지 않은 상태일 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인 필요"
 *                 authenticated:
 *                   type: boolean
 *                   example: false
 */
router.get('/users/check-auth', usersController.checkUserAuth);  // 로그인 여부 확인 API

/**
 * @swagger
 * /users/auth:
 *   post:
 *     tags:
 *       - User
 *     description: "로그인"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "로그인 이메일"
 *                 example: "test@test.kr"
 *               password:
 *                 type: string
 *                 description: "로그인 패스워드"
 *                 example: "12345"
 *     responses:
 *       '200':
 *         description: "로그인 성공했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session_id:
 *                   type: string
 *                   example: "d2d78s9ad727"
 *                 user_id:
 *                   type: string
 *                   example: "5"
 *                 role:
 *                   type: string
 *                   enum:
 *                     - user
 *                     - council
 *                     - admin
 *                     - webmaster
 *                   default: "user"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 게시판이름('tableName'), 제목('title'), 내용('content')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: 이메일"
 *       '401':
 *         description: "이메일 또는 비밀번호가 잘못 입력되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 실패: 이메일 또는 비밀번호가 잘못되었습니다."
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
router.post('/users/auth', isDeletedUser, usersController.loginUser);  // 로그인 API

/**
 * @swagger
 * /users/register:
 *   patch:
 *     tags:
 *       - User
 *     description: "회원가입, 유저 기본 정보가 생성되어 있어야 회원가입 할 수 있습니다."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stNum:
 *                 type: string
 *                 description: "회원가입 학번"
 *                 example: "test@test.kr"
 *               email:
 *                 type: string
 *                 description: "회원가입 이메일"
 *                 example: "test@test.kr"
 *               username:
 *                 type: string
 *                 description: "회원가입 이름"
 *                 example: "test@test.kr"
 *               password:
 *                 type: string
 *                 description: "회원가입 패스워드"
 *                 example: "12345"
 *               phoneNumber:
 *                 type: string
 *                 description: "회원가입 휴대폰번호, 하이픈 필수"
 *                 example: "010-1234-1234"
 *     responses:
 *       '201':
 *         description: "회원가입 성공했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "가입완료 / 유저ID = 3"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 학번('stNum'), 이메일('email'), 유저이름('username'), 패스워드('password'), 휴대폰번호('phoneNumber')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: 이메일"
 *       '409':
 *         description: "회원가입 이메일이 이미 존재할 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일이 이미 사용 중입니다."
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
router.patch('/users/register', usersController.registerUser);  // 회원가입 API

/**
 * @swagger
 * /users:
 *   delete:
 *     tags:
 *       - User
 *     description: "회원탈퇴 기능 (로그인 된 사용자만 가능)"
 *     responses:
 *       '201':
 *         description: "사용자 계정이 성공적으로 삭제되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원 탈퇴 완료"
 *       '404':
 *         description: "삭제할 유저 정보가 없을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보 없음"
 *       '500':
 *         description: "서버 내부 오류가 발생했을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "내부 서버 오류"
 */
router.delete('/users', isLoggedIn, usersController.deleteUser);  // 유저 정보 삭제 API

/**
 * @swagger
 * /users/findEmail:
 *   post:
 *     tags:
 *       - User
 *     description: "유저이름과 휴대폰번호를 사용해 이메일을 찾는 기능"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: "이메일찾기 이름"
 *                 example: "홍길동"
 *               phoneNumber:
 *                 type: string
 *                 description: "이메일찾기 휴대폰번호, 하이픈 필수"
 *                 example: "010-1234-1234"
 *     responses:
 *       '200':
 *         description: "이메일을 성공적으로 찾았을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "test@test.kr"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 유저이름('username'), 휴대폰번호('phoneNumber')이(가) 필수항목 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보 없음"
 *       '404':
 *         description: "회원가입 이메일이 이미 존재할 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일이 이미 사용 중입니다."
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
router.post('/users/findEmail', usersController.findUserEmail); // 이메일 찾기

/**
 * @swagger
 * /users/changePass:
 *   patch:
 *     tags:
 *       - User
 *     description: "이메일, 이름, 휴대폰번호를 사용해 패스워드 변경"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "사용자 이메일"
 *                 example: "test@test.kr"
 *               username:
 *                 type: string
 *                 description: "사용자 이름"
 *                 example: "홍길동"
 *               phonenum:
 *                 type: string
 *                 description: "휴대폰 번호, 하이픈 필수"
 *                 example: "010-1234-5678"
 *               newPass:
 *                 type: string
 *                 description: "새로운 패스워드"
 *                 example: "5342sad"
 *     responses:
 *       '201':
 *         description: "패스워드가 성공적으로 변경되었을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "패스워드 변경 완료"
 *       '400':
 *         description: "필수 항목이 누락되었을 때 반환됩니다. 필수 항목은 이메일('email'), 이름('username'), 휴대폰번호('phonenum'), 새로운 비밀번호('newPass') 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: 이메일"
 *       '404':
 *         description: "일치하는 계정 정보가 없을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "일치하는 유저 정보가 없습니다."
 *       '500':
 *         description: "서버 내부 오류가 발생했습니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "내부 서버 오류"
 */
router.patch('/users/changePass', isPassCheck, usersController.changeUserPass); // 비밀번호 변경

/**
 * @swagger
 * /users/:user_id:
 *   get:
 *     tags:
 *       - User
 *     description: "유저 ID로 사용자 정보 가져오기"
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: "조회할 유저의 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: "유저 정보를 성공적으로 가져왔을 때 반환됩니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: "홍길동"
 *                 email:
 *                   type: string
 *                   example: "test@test.kr"
 *                 phoneNumber:
 *                   type: string
 *                   example: "010-1234-1234"
 *       '400':
 *         description: "필수 항목이 누락되었 때 반환됩니다. 필수 항목은 사용자ID('user_id')이(가) 입니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수항목 누락: user_id 파라미터"
 *       '404':
 *         description: "해당 ID의 사용자 정보가 존재하지 않을 때 반환됩니다."
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
router.get('/users/:user_id', isLoggedIn, usersController.getUserById);  // User ID 로 유저정보 불러오기 API

router.patch('/users', isLoggedIn, usersController.updateUser);  // 유저 정보 업데이트 API

module.exports = router;