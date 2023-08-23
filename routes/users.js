const express = require('express');
const usersController = require('../controllers/users');
const isLoggendIn = require('../lib/middleware/auth').isLoggedIn;
const router = express.Router();

router.get('/users', isLoggendIn, usersController.loadUsers);           // Route for getting all users
router.get('/users/logout', usersController.logoutUser);                // Route for User logout
router.get('/users/check-auth', usersController.checkUserAuth);                    // Route for delete user
router.patch('/users', isLoggendIn, usersController.updateUser);        // Route for updating user
router.post('/users/auth', usersController.loginUser);                  // Route for User login
router.delete('/users', usersController.deleteUser);                    // Route for delete user

module.exports = router;