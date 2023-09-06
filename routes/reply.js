const express = require('express');
const replyController = require('../controllers/reply');
const isLoggedIn = require('../lib/auth').isLoggedIn;

const router = express.Router();

router.post('/reply/write', isLoggedIn, replyController.writeReply);  // 댓글 쓰기 API

module.exports = router;