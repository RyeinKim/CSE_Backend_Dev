const Post = require('../models/posts');
const mysql = require('mysql');

// 회원 정보 추가
exports.createUser = (req, res) => {
    const { email, username, password, phoneNumber } = req.body;

    if (!email || !username || !password || !phoneNumber) {
        return res.status(400).json({ error: 'Email, Username, Password, PhoneNumber are required.' });
    }

    Post.createUser(email, username, password, phoneNumber, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error.' });
        }
        return res.status(201).json({ message: 'User created successfully.' });
    });
};

exports.registerUser = (req, res) => {
    const {email, username, password, phoneNumber } = req.body;

    const reqData = {
        email: mysql.escape(email),
        username: mysql.escape(username),
        password: mysql.escape(password),
        phoneNumber: mysql.escape(phoneNumber)
    }

    Post.registerUser(reqData, (error, user_id) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const resData = {
            user_id: user_id
        };

        return res.status(201).json(resData);
    });
};