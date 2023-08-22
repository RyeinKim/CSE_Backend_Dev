const isLoggedIn = (req, res, next) => {
    console.log(`req.sessionID = ${req.sessionID}`);
    console.log(`req.session = ${req.session}`);
    console.log(`req.session.user_id = ${req.session.user_id}`);
    if (req.session.user_id) {
        next();
    } else {
        res.status(401).json({ message: "no auth" });
    }
};

module.exports = {
    isLoggedIn,
};