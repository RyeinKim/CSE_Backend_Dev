const db = require('../config/database');
const Users = require("../models/users");

const isLoggedIn = (req, res, next) => {
    console.log(`req.sessionID = ${req.sessionID}`);
    console.log(`req.session = ${req.session}`);
    console.log(`req.session.user_id = ${req.session.user_id}`);
    if (req.session.user_id) {
        next();
    } else {
        res.status(401).json({ message: "no auth" });
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

    Users.getUserByEmail(email, (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (user && user.deleteAt) {
            return res.status(401).json({ message: "Account has been deleted" });
        }

        next();
    });
    /*const userId = req.session.user_id;
console.log(`userId = `, userId);
// deleteAt 컬럼이 있는 경우 해당 값을 조회합니다.
const query = "SELECT deleteAt FROM users WHERE id = ?";
db.connection.query(query, [userId], (error, results) => {
    if (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    } else {
        // deleteAt 값이 null이면 계정이 삭제되지 않은 상태입니다.
        if (results[0] && results[0].deleteAt === null) {
            next(); // 삭제되지 않은 경우 다음 미들웨어 호출
        } else {
            res.status(401).json({ message: "Deleted account" });
        }
    }
});*/
}

module.exports = {
    isLoggedIn,
    isDeletedUser,
};