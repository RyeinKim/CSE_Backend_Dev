const User = require("../models/users");
const {devlog, errorlog} = require("../config/config");
const userUtils = require("../utils/userUtils");

const isLoggedIn = (req, res, next) => {
    if (req.session.user_id) {
        next();
    } else {
        res.status(401).json({ error: "로그인 필요" });
    }
}

/**
 * isDeletedAccount 미들웨어를 만들어서,
 * 로그인한 사용자가 삭제된 계정인지 확인하는 로직을 구현
 * deleteAt 컬럼 값을 조회하여 값이 null인 경우에는 계정이 삭제되지 않은 상태로 간주하고,
 * 삭제된 경우에는 401 Unauthorized 상태 코드와 메시지를 반환합니다.
 */
const isDeletedUser = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: '필수항목 누락: 이메일' });
    }

    try {
        const user = await userUtils.getUserByEmail(email);
        if (user && user.deleteAt) {
            return res.status(401).json({ message: "삭제된 계정으로 접근 중" });
        }
        next();
    } catch (error) {
        if (error) {
            errorlog(error);
            return res.status(500).json({ message: "내부 서버 오류" });
        }
    }
}

function isPassCheck(req, res, next) {
    const { email, username, phonenum, newPass } = req.body;

    if (!email) {
        return res.status(400).json({ message: '필수항목 누락: 이메일' });
    }
    if (!username) {
        return res.status(400).json({ message: '필수항목 누락: 유저이름' });
    }
    if (!phonenum) {
        return res.status(400).json({ message: '필수항목 누락: 휴대폰번호' });
    }
    if (!newPass) {
        return res.status(400).json({ message: '필수항목 누락: 새로운 비밀번호' });
    }

    const reqData = {
        email: email,
        username: username,
        phonenum: phonenum,
        newPass: newPass
    }

    devlog(`isPassCheck email = `, email);
    devlog(`isPassCheck username = `, username);
    devlog(`isPassCheck phonenum = `, phonenum);
    devlog(`isPassCheck newPass = `, newPass);

    User.checkUserPass(reqData)
        .then((user) => {
            if (!user) {
                devlog('User not found');
                return res.status(404).json({ message: '유저 정보 없음' });
            }
            next();
        })
        .catch((error) => {
            errorlog('Error in User.checkUserPass:', error);
            return res.status(500).json({ message: '내부 서버 오류' });
        })
}

const isWebmaster = async (req, res, next) => {
    const { role } = req.session;

    if (!req.session) {
        return res.status(400).json({ message: '로그인 필요' });
    }

    if (!(role === 'webmaster')) {
        return res.status(401).json({ message: '웹마스터 권한 없음' });
    }
    next();
}

const isAdmin = async (req, res, next) => {
    const { role } = req.session;

    if (!req.session) {
        return res.status(400).json({ message: '로그인 필요' });
    }

    if (role === 'webmaster' || role === 'admin') {
        next();
    } else {
        return res.status(401).json({ message: '관리자 권한 없음' });
    }
}

const isCouncil = async (req, res, next) => {
    const { role } = req.session;

    if (!req.session) {
        return res.status(400).json({ message: '로그인 필요' });
    }

    if (role === 'webmaster' || role === 'admin' || role === 'council') {
        next();
    } else {
        return res.status(401).json({ message: '학생회 or 학과 동아리 임원 권한 없음' });
    }
}

module.exports = {
    isLoggedIn,
    isDeletedUser,
    isPassCheck,
    isWebmaster,
    isAdmin,
    isCouncil,
};