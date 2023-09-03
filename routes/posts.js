const express = require('express');
const postsController = require('../controllers/posts');
const isLoggedIn = require('../lib/auth').isLoggedIn;

const router = express.Router();

router.post('/users/register', postsController.registerUser);  // 회원가입 API
router.post('/posts/write', isLoggedIn, postsController.writePost);  // 게시글 쓰기 API
router.get('', isLoggedIn, postsController.getUserById);  // User ID 로 유저정보 불러오기 API
router.get('/posts', postsController.getPostsAll);  // 모든 게시글 불러오기 API
router.get('/posts/:post_id', isLoggedIn, postsController.getPostById);  // 게시글 ID 로 게시글 불러오기 API
router.delete('/posts/delete/:post_id', isLoggedIn, postsController.deletePostById);
router.get('/delposts', postsController.getDeletedPosts);  // 모든 게시글 불러오기 API

module.exports = router;