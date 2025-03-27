function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.redirect("/login");
}

function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ message: "Access denied. Admins only." });
}

module.exports = { isAuthenticated, isAdmin };
