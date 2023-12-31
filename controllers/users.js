const User = require("../models/users");
const { devlog, errorlog } = require("../config/config");
const userUtils = require("../utils/userUtils");
const bcrypt = require('bcrypt');

/**
 * 회원 정보 목록 조회
 * 회원 전화번호 업데이트
 * 회원 정보 삭제
 * 회원 로그인
 * 회원 로그아웃
 * 로그인 상태 확인
 * 이메일로 유저정보 가져오기
 */

// 회원 전화번호 업데이트
exports.updateUser = async (req, res) => {
    const { email, phoneNumber } = req.body;

    devlog(`[Cont] updateUser req.session = ${req.session}`);
    devlog(`[Cont] updateUser email = ${email}`);
    devlog(`[Cont] updateUser phoneNumber = ${phoneNumber}`);

    if (!email) {
        return res.status(400).json({ message: '필수항목 누락: 이메일' });
    }
    if (!phoneNumber) {
        return res.status(400).json({ message: '필수항목 누락: 휴대폰번호' });
    }

    const reqData = {
        email: email,
        phoneNumber: phoneNumber
    }

    try {
        const updatedUser = await User.updateUser(reqData);

        if (!updatedUser) {
            return res.status(404).json({ message: '유저 정보 없음' });
        }
        return res.status(201).json({ message: `휴대폰 번호 업데이트 완료` });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류'});
    }
}

// 회원 정보 삭제 (로그인 된 계정)
exports.deleteUser = async (req, res) => {
    const user_id = req.session.user_id;

    try {
        const resData = await User.deleteUser(user_id);

        if (resData === null) {
            return res.status(404).json({ message: '유저 정보 없음' });
        }

        req.session.destroy();
        return res.status(201).json({ message: `회원 탈퇴 완료` });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 회원 로그인
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: '필수항목 누락: 이메일' });
    }
    if (!password) {
        return res.status(400).json({ message: '필수항목 누락: 패스워드' });
    }

    try {
        const user = await User.loginUser(email);

        if (!user) {
            return res.status(401).json({ message: '인증 실패: 이메일 또는 비밀번호가 잘못되었습니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: '인증 실패: 이메일 또는 비밀번호가 잘못되었습니다.' });
        }

        devlog(req.session);
        req.session.user_id = user.id;
        req.session.role = user.role;
        return res.status(200).json({
            user_id: user.id,
            session_id: req.sessionID,
            role: user.role,
        });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 회원가입
exports.registerUser = async (req, res) => {
    const { stNum, email, username, password, phoneNumber } = req.body;

    if (!stNum) {
        return res.status(400).json({ message: '필수항목 누락: 학번' });
    }
    if (!email) {
        return res.status(400).json({ message: '필수항목 누락: 이메일' });
    }
    if (!username) {
        return res.status(400).json({ message: '필수항목 누락: 유저이름' });
    }
    if (!password) {
        return res.status(400).json({ message: '필수항목 누락: 패스워드' });
    }
    if (!phoneNumber) {
        return res.status(400).json({ message: '필수항목 누락: 휴대폰번호' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 10은 saltRounds
        const reqData = {
            stNum: stNum,
            email: email,
            username: username,
            password: hashedPassword,
            phoneNumber: phoneNumber,
        }

        const user_id = await User.registerUser(reqData);
        return res.status(201).json({ message: `가입완료 / 유저ID = ${user_id}` });
    } catch (error) {
        errorlog(error);
        if (error.message === '일치하는 계정 정보 없음') {
            return res.status(404).json({ message: '일치하는 계정 정보가 없습니다.' });
        }
        if (error.message === '중복되는 이메일') {
            return res.status(409).json({ message: '이메일이 이미 사용 중입니다.' });
        }
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 이메일 찾기
exports.findUserEmail = async (req, res) => {
    const { username, phonenum } = req.body;

    if (!username) {
        return res.status(400).json({ message: '필수항목 누락: 유저이름' });
    }
    if (!phonenum) {
        return res.status(400).json({ message: '필수항목 누락: 휴대폰번호' });
    }

    const reqData = {
        username: username,
        phonenum: phonenum,
    }

    try {
        const user = await User.findUserEmail(reqData);
        if (!user) {
            return res.status(404).json({ message: '유저 정보 없음' });
        }
        return res.status(200).json(user);
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 비밀번호 찾기
exports.checkUserPass = async (req, res) => {
    const { email, username, phonenum } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: '필수항목 누락: 이메일' });
    }
    if (!username) {
        return res.status(400).json({ message: '필수항목 누락: 유저이름' });
    }
    if (!phonenum) {
        return res.status(400).json({ message: '필수항목 누락: 휴대폰번호' });
    }
    
    const reqData = {
        email: email,
        username: username,
        phonenum: phonenum
    }

    try {
        const user = User.checkUserPass(reqData);

        if (!user) {
            return res.status(404).json({ message: '유저 정보 없음' });
        }
        return res.status(200).json(user);
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

exports.changeUserPass = async (req, res) => {
    console.log("controller IN!!!!!!!!!!!!!");
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

    try {
        const user = await userUtils.changeUserPass(reqData);
        if (!user) {
            return res.status(404).json({ message: '일치하는 유저 정보가 없습니다.' });
        }
        return res.status(201).json({ message: `패스워드 변경 완료` });
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류'});
    }
}

// 유저 ID로 유저 이름 가져오기 (API)
exports.getUserById = async (req, res) => {
    const user_id = req.params.user_id;

    if (!user_id) {
        return res.status(400).json({ message: '필수항목 누락: user_id 파라미터' });
    }

    try {
        const user = await User.getUserById(user_id);

        if (!user) {
            return res.status(404).json({ message: '유저 정보 없음' });
        }
        return res.status(200).json(user);
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}

// 유저 ID로 유저 이름 가져오기 (함수)
exports.getUserByUserId = async (req, res) => {
    const user_id = req.body.user_id;

    if (!user_id) {
        return res.status(400).json({ message: '필수항목 누락: 유저 ID' });
    }

    try {
        const user = await userUtils.getUserByUserId(user_id);

        if (!user) {
            return res.status(404).json({ message: '유저 정보 없음' });
        }
        return res.status(200).json(user);
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 함수 오류' });
    }
}

// 회원 로그아웃
exports.logoutUser = (req, res) => {
    devlog(`logout req.session = ${req.session}`);
    const user_id = req.session.user_id;

    req.session.destroy((error) => {
        if (error) {
            errorlog(error);
            return res.status(500).json({ message: '로그아웃 실패' });
        }
        return res.status(200).json({ message: '로그아웃 성공' });
    });
}

// 로그인 상태 확인
exports.checkUserAuth = (req, res) => {
    if (req.session.user_id) {
        // 사용자가 로그인되어 있는 경우
        res.status(200).json({
            authenticated: true,
            user_id: req.session.user_id,
            role: req.session.role,
        });
    } else {
        // 사용자가 로그인되어 있지 않은 경우
        res.status(401).json({
            message: '로그인 필요',
            authenticated: false
        });
    }
}

// 이메일로 유저정보 가져오기
exports.getUserByEmail = async (req, res) => {
    const email = req.params.email;

    try {
        const user = await userUtils.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: '유저 정보 없음' });
        }
        return res.status(200).json(user);
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
}