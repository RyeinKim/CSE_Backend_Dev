const express = require('express');
const replyController = require('../controllers/reply');
const isLoggedIn = require('../lib/auth').isLoggedIn;

const router = express.Router();

router.post('/reply/write/:tableName', isLoggedIn, replyController.writeReply);  // 댓글 쓰기 API
router.get('/reply/:tableName/:post_id', isLoggedIn, replyController.getReplyByPostId);  // 게시글 ID 로 게시글 불러오기 API
router.get('/reply/:tableName/user/:user_id', isLoggedIn, replyController.getReplyByUserId);  // 유저 ID 로 게시글 불러오기 API
router.delete('/reply/delete/:tableName/:reply_id', isLoggedIn, replyController.deleteReplyById);
router.get('/delReply/:tableName', isLoggedIn, replyController.getDeletedReply);
router.patch('/reply/edit/:tableName/:reply_id', isLoggedIn, replyController.editReply);

module.exports = router;