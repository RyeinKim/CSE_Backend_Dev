const express = require('express');
const usersController = require('../controllers/users');
const router = express.Router();

router.get('/users', usersController.loadUsers);            // Route for getting all users
router.patch('/users', usersController.updateUser);         // Route for updating user
router.delete('/users/:id', usersController.deleteUser);    // Route for delete user

module.exports = router;