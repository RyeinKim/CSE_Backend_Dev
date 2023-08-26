const User = require("../models/users");
const mysql = require('mysql');
const {devlog} = require("../config/config");

/**
 * 회원 정보 목록 조회
 * 회원 전화번호 업데이트
 * 회원 정보 삭제
 * 회원 로그인
 * 회원 로그아웃
 * 로그인 상태 확인
 */

// 회원 정보 목록 조회
exports.loadUsers = (req, res) => {
    const { offset, limit } = req.query;

    if (!offset || isNaN(offset) || offset < 0) {
        return res.status(400).json({ code: 'invalid_offset' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ code: 'invalid_limit' });
    }

    const reqData = {
        offset: offset,
        limit: limit,
    };

    User.loadUsers(reqData, (error, resData) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: '내부 서버 오류' });
        } else {
            devlog(`getUsers Controllers`);
            devlog(`resData = ${resData}`);
            return res.status(200).json({ message: resData });
        }
    });
}

// 회원 전화번호 업데이트
exports.updateUser = (req, res) => {
    console.log(`[Cont] updateUser req.session = `, req.session);
    const { email, phoneNumber } = req.body;
    console.log(`[Cont] updateUser email = `, email);
    console.log(`[Cont] updateUser phoneNumber = `, phoneNumber);
    const reqData = {
        email: email,
        phoneNumber: phoneNumber
    }

    if (!email || !phoneNumber) {
        return res.status(400).json({ error: 'Email, PhoneNumber are required.' });
    }

    User.updateUser(reqData, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error.'});
        }
        return res.status(201).json({ message: `User's phonenumber updated successfully.` });
    });
}

// 회원 정보 삭제
exports.deleteUser = (req, res) => {
    const user_id = req.session.user_id;
    if (!user_id) return res.status(400).json({ code: 'invalid_user_id' });

    const reqData = {
        user_id: mysql.escape(user_id)
    };

    User.deleteUser(reqData, (error, resData) => {
        if (error) {
            return res.status(500).json({ error: 'Database error.' });
        }
        if (resData === null) {
            return res.status(404).json({ code: 'not_found_user' });
        }
        return res.status(204).end();
    });
}

// 회원 로그인
exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    devlog(`email = ${email}`);
    devlog(`password = ${password}`);
    const reqData = {
        email: email,
        password: password
    }
    // console.log(`reqData = `, reqData);
    User.loginUser(reqData, (error, resData) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (resData === null) {
            return res.status(401).json({ error: 'invalid email or password' });
        }

        req.session.user_id = resData;
        devlog(`[B] req.sessionID = ${req.sessionID}`);
        devlog(`[B] req.session.user_id = ${req.session.user_id}`);
        return res.status(200).json({ user_id: resData, session_id: req.sessionID });
    });
}

// 회원 로그아웃
exports.logoutUser = (req, res) => {
    console.log(`logout req.session = `, req.session);
    const user_id = req.session.user_id;
    if (!user_id) return res.status(400).json({ error: 'invalid_user_id '});
    req.session.destroy();
    return res.status(204).end();
}

// 로그인 상태 확인
exports.checkUserAuth = (req, res) => {
    if (req.session.user_id) {
        // 사용자가 로그인되어 있는 경우
        res.status(200).json({ authenticated: true });
    } else {
        // 사용자가 로그인되어 있지 않은 경우
        res.status(401).json({ authenticated: false });
    }
}

