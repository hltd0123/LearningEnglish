const jwt = require("jsonwebtoken");
const config = require("./../config/setting.json");

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.userData = {
        user: decoded.user,
      };
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Failed to authenticate token.' });
    }
}

module.exports = verifyToken;