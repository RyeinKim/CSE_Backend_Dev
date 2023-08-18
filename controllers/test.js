const User = require("../models/users");

/**
 * 회원 정보 목록 조회
 * 회원 전화번호 업데이트
 * 회원 정보 삭제
 */

// 회원 정보 목록 조회
exports.loadUsers = (req, res) => {
    User.loadUsers((error, users) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: '내부 서버 오류' });
        } else {
            console.log(`getUsers Controllers`);
            console.log(users);
            res.status(200).json(users);
        }
    });
};

// 회원 전화번호 업데이트
exports.updateUser = (req, res) => {
    const { email, phoneNumber } = req.body;

    if (!email || !phoneNumber) {
        return res.status(400).json({ error: 'Email, PhoneNumber are required.' });
    }

    User.updateUser(email, phoneNumber, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error.'});
        }
        return res.status(201).json({ message: `User's phonenumber updated successfully.` });
    });
}

// 회원 정보 삭제
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    User.deleteUser(id, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error.' });
        }
        return res.status(201).json({ message: 'User deleted successfully.' });
    });
}