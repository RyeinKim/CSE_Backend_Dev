const Post = require('../models/posts');

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