const express = require('express');
const replyController = require('../controllers/reply');
const isLoggedIn = require('../lib/auth').isLoggedIn;

const router = express.Router();

router.post('/reply/write/:tableName', isLoggedIn, replyController.writeReply);  // 댓글 쓰기 API
router.get('/reply/:post_id', isLoggedIn, replyController.getReplyByPostId);  // 게시글 ID 로 게시글 불러오기 API
router.get('/reply/:user_id', isLoggedIn, replyController.getReplyByUserId);  // 유저 ID 로 게시글 불러오기 API
router.delete('/reply/delete/:reply_id', isLoggedIn, replyController.deleteReplyById);
router.get('/delReply', isLoggedIn, replyController.getDeletedReply);
router.patch('/reply/edit/:reply', isLoggedIn, replyController.editReply);

module.exports = router;