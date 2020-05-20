function isLoggedIn(req, res, next) {
    if (req.user) {
        res.redirect('/auth/google/redirect');
    } else {
        next();
    }
}

module.exports = isLoggedIn;