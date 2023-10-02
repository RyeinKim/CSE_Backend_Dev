const express = require('express');
const usersController = require('../controllers/users');
const isLoggedIn = require('../lib/auth').isLoggedIn;
const isDeletedUser = require('../lib/auth').isDeletedUser;
const isPassCheck = require('../lib/auth').isPassCheck;
const router = express.Router();

router.get('/users/logout', isLoggedIn, usersController.logoutUser);  // 로그아웃 API
router.get('/users/check-auth', usersController.checkUserAuth);  // 로그인 여부 확인 API
router.patch('/users', isLoggedIn, usersController.updateUser);  // 유저 정보 업데이트 API
router.post('/users/auth', isDeletedUser, usersController.loginUser);  // 로그인 API
router.patch('/users/register', usersController.registerUser);  // 회원가입 API
router.delete('/users', isLoggedIn, usersController.deleteUser);  // 유저 정보 삭제 API
router.post('/users/findEmail', usersController.findUserEmail); // 이메일 찾기
router.patch('/users/changePass', isPassCheck, usersController.changeUserPass); // 비밀번호 변경
router.get('/users/:user_id', isLoggedIn, usersController.getUserById);  // User ID 로 유저정보 불러오기 API

module.exports = router;