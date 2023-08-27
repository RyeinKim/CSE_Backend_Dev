const express = require('express');
const postsController = require('../controllers/posts');
const isLoggedIn = require('../lib/middleware/auth').isLoggedIn;

const router = express.Router();

// router.post('/posts', postsController.createUser); // Route for add new user
router.post('/users/register', postsController.registerUser);
router.post('/posts/write', isLoggedIn, postsController.writePost);
router.get('', isLoggedIn, postsController.getUserById);
router.get('/posts', postsController.getPostsAll);
router.get('/posts/:post_id', isLoggedIn, postsController.getPostById);

module.exports = router;