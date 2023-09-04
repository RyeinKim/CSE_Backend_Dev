const express = require('express');
const usersController = require('../controllers/users');
const isLoggendIn = require('../lib/auth').isLoggedIn;
const isDeletedUser = require('../lib/auth').isDeletedUser;
const router = express.Router();

router.get('/users', isLoggendIn, usersController.loadUsers);  // 유저 목록 불러오기 API
router.get('/users/logout', isLoggendIn, usersController.logoutUser);  // 로그아웃 API
router.get('/users/check-auth', usersController.checkUserAuth);  // 로그인 여부 확인 API
router.patch('/users', isLoggendIn, usersController.updateUser);  // 유저 정보 업데이트 API
router.post('/users/auth', isDeletedUser, usersController.loginUser);  // 로그인 API
router.delete('/users', isLoggendIn, usersController.deleteUser);  // 유저 정보 삭제 API
router.get('', usersController.getUserByEmail);  // 이메일로 유저정보 불러오기 API
router.get('/users/findEmail', usersController.findUserEmail); // 이메일 찾기

module.exports = router;