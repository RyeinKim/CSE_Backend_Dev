const express = require('express');
const postsController = require('../controllers/posts');
const isLoggedIn = require('../lib/auth').isLoggedIn;

const router = express.Router();

router.post('/users/register', postsController.registerUser);  // 회원가입 API
router.post('/posts/write/:tableName', isLoggedIn, postsController.writePost);  // 게시글 쓰기 API
router.get('/posts/board/:tableName', isLoggedIn, postsController.getPostsAll);  // 모든 게시글 불러오기 API
router.get('/posts/:tableName/:post_id', isLoggedIn, postsController.getPostByPostId);  // 게시글 ID 로 게시글 불러오기 API
router.get('/posts/getPost/:tableName/:user_id', isLoggedIn, postsController.getPostByUserId); // 유저 ID로 게시글 목록 불러오기
router.delete('/posts/delete/:tableName/:post_id', isLoggedIn, postsController.deletePostById);
router.get('/delposts/:tableName', isLoggedIn, postsController.getDeletedPosts);  // 모든 게시글 불러오기 API

module.exports = router;