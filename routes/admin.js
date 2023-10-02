const express = require('express');
const adminController = require('../controllers/admin');
const isAdmin = require('../lib/auth').isAdmin;
const router = express.Router();

router.post('/admin/createUser', isAdmin, adminController.createUser);
router.delete('/admin/deleteUser/:user_id', isAdmin, adminController.deleteUserByUserId);
router.delete('/admin/posts/delete/:tableName/:post_id', isAdmin, adminController.adminDeletePostById);
router.delete('/admin/reply/delete/:tableName/:reply_id', isAdmin, adminController.adminDeleteReplyById);
router.get('/admin/users', isAdmin, adminController.loadUsers);  // 유저 목록 불러오기 API
router.patch('/posts/recover/:tableName/:post_id', isAdmin, adminController.recoverPostByPostId);
router.patch('/reply/recover/:tableName/:reply_id', isAdmin, adminController.recoverReplyById);
router.patch('/users/recover/:user_id', isAdmin, adminController.recoverUserByUserId);

module.exports = router;