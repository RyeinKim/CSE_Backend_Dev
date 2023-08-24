const Post = require('../models/posts');
const mysql = require('mysql');
/*// 회원 정보 추가
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
};*/

exports.registerUser = (req, res) => {
    const {email, username, password, phoneNumber } = req.body;

    if (!email || !username || !password || !phoneNumber) {
        return res.status(400).json({ error: 'Email, Username, Password, PhoneNumber are required.' });
    }

    if (email === null || username === null || password === null || phoneNumber === null) {
        return res.status(400).json({ error: 'Email, Username, Password, PhoneNumber are required.' });
    }

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

        return res.status(201).json({ message: `Register Success. Your id is ${resData.user_id}` });
    });
};

exports.writePost = (req, res) => {
    const { title, content } = req.body;
    const { user_id } = req.session; // 로그인한 사용자의 user_id

    if (!title || title === null) {
        return res.status(400).json({ error: 'Title is required.' });
    }

    if (!content || content === null) {
        return res.status(400).json({ error: 'Content is required.' });
    }

    if (!user_id) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    console.log("Here is ok");

    // user_id를 사용하여 사용자 정보 조회
    Post.getUserById(user_id, (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        const reqData = {
            title: mysql.escape(title),
            content: mysql.escape(content),
            author: mysql.escape(user.username), // 사용자 정보에서 username 사용
            author_id: mysql.escape(user_id),
        }

        Post.registerUser(reqData, (error, post_id) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred' });
            }

            return res.status(201).json({ message: `Upload post Success. Post ID is ${post_id}` });
        });
    });
}

exports.getUserById = (req, res) => {
    const user_id = req.params.user_id;

    Post.getUserById(user_id, (error, user) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    });
}