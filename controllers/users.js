const User = require("../models/users");
const mysql = require('mysql');
const { devlog, errorlog} = require("../config/config");
const userUtils = require("../utils/userUtils");

/**
 * 회원 정보 목록 조회
 * 회원 전화번호 업데이트
 * 회원 정보 삭제
 * 회원 로그인
 * 회원 로그아웃
 * 로그인 상태 확인
 * 이메일로 유저정보 가져오기
 */

// 회원 정보 목록 조회
exports.loadUsers = async (req, res) => {
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

    try {
        const resData = await User.loadUsers(reqData);
        devlog(`getUsers Controllers`);
        devlog(`resData = ${resData}`);
        return res.status(200).json({ message: resData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}
/*
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

    User.loadUsers(reqData)
        .then((resData) => {
            devlog(`getUsers Controllers`);
            devlog(`resData = ${resData}`);
            return res.status(200).json({ message: resData });
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ message: '내부 서버 오류' });
        });
}
*/

// 회원 전화번호 업데이트
exports.updateUser = async (req, res) => {
    devlog(`[Cont] updateUser req.session = ${req.session}`);
    const { email, phoneNumber } = req.body;
    devlog(`[Cont] updateUser email = ${email}`);
    devlog(`[Cont] updateUser phoneNumber = ${phoneNumber}`);

    const reqData = {
        email: email,
        phoneNumber: phoneNumber
    }

    if (!email || !phoneNumber) {
        return res.status(400).json({ error: 'Email, PhoneNumber are required.' });
    }

    try {
        // 데이터베이스 업데이트 수행
        const updatedUser = await User.updateUser(reqData);

        // 업데이트 결과 확인
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 업데이트 성공 응답
        return res.status(201).json({ message: `User's phonenumber updated successfully.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '내부 서버 오류'});
    }
}
/*
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

    User.updateUser(reqData)
        .then((resData) => {
            return res.status(201).json({ message: `User's phonenumber updated successfully.` });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: '내부 서버 오류'});
        });
}
*/

// 회원 정보 삭제
/*
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

exports.deleteUser = (req, res) => {
    const user_id = req.session.user_id;
    if (!user_id) return res.status(400).json({ code: 'invalid_user_id' });

    const reqData = {
        user_id: mysql.escape(user_id)
    };

    User.deleteUser(reqData)
        .then((resData) => {
            if (resData === null) {
                return res.status(404).json({ code: 'not_found_user' });
            }
            req.session.destroy();
            return res.status(204).end();
        })
        .catch((error) => {
            return res.status(500).json({ error: 'Database error.' });
        });
}
*/
exports.deleteUser = async (req, res) => {
    const user_id = req.session.user_id;
    if (!user_id) return res.status(400).json({ code: 'invalid_user_id' });

    const reqData = {
        user_id: mysql.escape(user_id)
    };

    try {
        const resData = await User.deleteUser(reqData);

        if (resData === null) {
            return res.status(404).json({ code: 'not_found_user' });
        }

        req.session.destroy();
        return res.status(204).end();
    } catch (error) {
        return res.status(500).json({ error: 'Database error.' });
    }


}

// 회원 로그인
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    devlog(`email = ${email}`);
    devlog(`password = ${password}`);
    const reqData = {
        email: email,
        password: password
    }
    devlog(`reqData = `, reqData);

    try {
        const resData = await User.loginUser(reqData);

        if (resData === null) {
            return res.status(401).json({ error: 'invalid email or password' });
        }

        req.session.user_id = resData;
        devlog(`[B] req.sessionID = ${req.sessionID}`);
        devlog(`[B] req.session.user_id = ${req.session.user_id}`);
        return res.status(200).json({ user_id: resData, session_id: req.sessionID });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ error: '내부 서버 오류' });
    }
}
/*exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    devlog(`email = ${email}`);
    devlog(`password = ${password}`);
    const reqData = {
        email: email,
        password: password
    }
    devlog(`reqData = `, reqData);

    try {
        const resData = await User.loginUser(reqData);

        if (resData === null) {
            return res.status(401).json({ error: 'invalid email or password' });
        }

        req.session.user_id = resData;
        devlog(`[B] req.sessionID = ${req.sessionID}`);
        devlog(`[B] req.session.user_id = ${req.session.user_id}`);
        return res.status(200).json({ user_id: resData, session_id: req.sessionID });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}*/
/*exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    devlog(`email = ${email}`);
    devlog(`password = ${password}`);
    const reqData = {
        email: email,
        password: password
    }
    devlog(`reqData = `, reqData);

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
}*/

// 이메일 찾기
exports.findUserEmail = async (req, res) => {
    const { username, phonenum } = req.body;

    const reqData = {
        username: username,
        phonenum: phonenum
    }

    try {
        const user = await User.findUserEmail(reqData);
        if (!user) {
            return res.status(404).json({ error: '유저 정보 없음' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '내부 서버 오류' });
    }
}

// 비밀번호 찾기
exports.checkUserPass = async (req, res) => {
    const { email, username, phonenum } = req.body;
    const reqData = {
        email: email,
        username: username,
        phonenum: phonenum
    }

    try {
        const user = User.checkUserPass(reqData);

        if (!user) {
            return res.status(404).json({ error: '유저 정보 없음' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '내부 서버 오류' });
    }
}
/*exports.checkUserPass = (req, res) => {
    const { email, username, phonenum } = req.body;
    const reqData = {
        email: email,
        username: username,
        phonenum: phonenum
    }

    User.checkUserPass(reqData, (error, user) => {
        if (error) {
            return res.status(500).json({ error: '내부 서버 오류' });
        }

        if (!user) {
            return res.status(404).json({ error: '유저 정보 없음' });
        }

        return res.status(200).json(user);
    });
}*/

exports.changeUserPass = async (req, res) => {
    console.log("controller IN!!!!!!!!!!!!!");
    const { email, username, phonenum, newPass } = req.body;
    const reqData = {
        email: email,
        username: username,
        phonenum: phonenum,
        newPass: newPass
    }

    try {
        const user = await userUtils.changeUserPass(reqData);
        return res.status(201).json({ message: `User's password changed successfully.` });
    } catch (error) {
        return res.status(500).json({ error: 'Database error.'});
    }
}

/*exports.changeUserPass = (req, res) => {
    console.log("controller IN!!!!!!!!!!!!!");
    const { email, username, phonenum, newPass } = req.body;
    const reqData = {
        email: email,
        username: username,
        phonenum: phonenum,
        newPass: newPass
    }

    userUtils.changeUserPass(reqData, (error, user) => {
        if (error) {
            return res.status(500).json({ error: 'Database error.'});
        }
        return res.status(201).json({ message: `User's password changed successfully.` });
    });
}*/

// 유저 ID로 유저 이름 가져오기 (API)
exports.getUserById = async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const user = await User.getUserById(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: '내부 서버 오류' });
    }
}

// 유저 ID로 유저 이름 가져오기 (함수)
exports.getUserByUserId = async (req, res) => {
    const user_id = req.body.user_id;

    try {
        const user = await userUtils.getUserByUserId(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: '내부 함수 오류' });
    }
}

// 회원 로그아웃
exports.logoutUser = (req, res) => {
    devlog(`logout req.session = ${req.session}`);
    const user_id = req.session.user_id;
    if (!user_id) return res.status(400).json({ error: 'invalid_user_id '});
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        return res.status(201).json({ message: 'Logout successful' });
    });
}

// 로그인 상태 확인
exports.checkUserAuth = (req, res) => {
    if (req.session.user_id) {
        // 사용자가 로그인되어 있는 경우
        res.status(200).json({ authenticated: true, user_id: req.session.user_id });
    } else {
        // 사용자가 로그인되어 있지 않은 경우
        res.status(401).json({ authenticated: false });
    }
}

// 이메일로 유저정보 가져오기
exports.getUserByEmail = async (req, res) => {
    const email = req.params.email;

    try {
        const user = await userUtils.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}