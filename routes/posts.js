const express = require('express');
const postsController = require('../controllers/posts');
const isLoggendIn = require('../lib/middleware/auth').isLoggedIn;

const router = express.Router();

// router.post('/posts', postsController.createUser); // Route for add new user
router.post('/users/register', postsController.registerUser);
router.post('/posts/write', isLoggendIn, postsController.writePost);
router.get('', isLoggendIn, postsController.getUserById);

module.exports = router;