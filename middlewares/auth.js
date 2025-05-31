const jwt = require('jsonwebtoken');
const config = require('../config');
const TokenBlacklist = require('../models/tokenBlacklist');

module.exports = async function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  // Проверка в черном списке
  const blacklisted = await TokenBlacklist.findOne({ where: { token } });
  if (blacklisted) return res.status(401).json({ message: 'Token is blacklisted' });

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}; 