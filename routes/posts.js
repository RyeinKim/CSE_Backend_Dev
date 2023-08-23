const express = require('express');
const postsController = require('../controllers/posts');

const router = express.Router();

router.post('/posts', postsController.createUser); // Route for add new user
router.post('/users/register', postsController.registerUser);

module.exports = router;