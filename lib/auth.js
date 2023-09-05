// const db = require('../config/database');
const User = require("../models/users");
const {devlog} = require("../config/config");

const isLoggedIn = (req, res, next) => {
    console.log(`req.sessionID = ${req.sessionID}`);
    console.log(`req.session = ${req.session}`);
    console.log(`req.session.user_id = ${req.session.user_id}`);
    if (req.session.user_id) {
        next();
    } else {
        res.status(401).json({ error: "no auth" });
    }
}

/**
 * isDeletedAccount 미들웨어를 만들어서,
 * 로그인한 사용자가 삭제된 계정인지 확인하는 로직을 구현
 * deleteAt 컬럼 값을 조회하여 값이 null인 경우에는 계정이 삭제되지 않은 상태로 간주하고,
 * 삭제된 경우에는 401 Unauthorized 상태 코드와 메시지를 반환합니다.
 */
const isDeletedUser = (req, res, next) => {
    const { email } = req.body;

    User.getUserByEmail(email, (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (user && user.deleteAt) {
            return res.status(401).json({ message: "Account has been deleted" });
        }

        next();
    });
}

function isPassCheck(req, res, next) {
    const { email, username, phonenum, newPass } = req.body;
    const reqData = {
        email: email,
        username: username,
        phonenum: phonenum,
        newPass: newPass
    }
    console.log(`isPassCheck email = `, email);
    console.log(`isPassCheck username = `, username);
    console.log(`isPassCheck phonenum = `, phonenum);
    console.log(`isPassCheck newPass = `, newPass);
    User.checkUserPass(reqData, (error, user) => {
        if (error) {
            devlog('Error in User.checkUserPass:', error);
            return res.status(500).json({ error: '내부 서버 오류' });
        }

        if (!user) {
            devlog('User not found');
            return res.status(404).json({ error: '유저 정보 없음' });
        }

        next();
    });
}

module.exports = {
    isLoggedIn,
    isDeletedUser,
    isPassCheck,
};