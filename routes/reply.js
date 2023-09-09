const express = require('express');
const replyController = require('../controllers/reply');
const postsController = require("../controllers/posts");
const isLoggedIn = require('../lib/auth').isLoggedIn;

const router = express.Router();

router.post('/reply/write', isLoggedIn, replyController.writeReply);  // 댓글 쓰기 API
router.get('', isLoggedIn, replyController.getUserById);  // User ID 로 유저정보 불러오기 API
router.get('/reply/:post_id', isLoggedIn, replyController.getReplyByPostId);  // 게시글 ID 로 게시글 불러오기 API

module.exports = router;