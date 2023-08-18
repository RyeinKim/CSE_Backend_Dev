const isLoggedIn = (req, res, next) => {
    if (req.session.user_id) {
        next();
    } else {
        res.status(401).json({ message: "no auth" });
    }
};

module.exports = {
    isLoggedIn,
};