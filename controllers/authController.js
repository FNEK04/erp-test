const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');
const TokenBlacklist = require('../models/tokenBlacklist');

function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, config.jwt.secret, { expiresIn: config.jwt.accessExpiresIn });
  const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
  return { accessToken, refreshToken };
}

exports.signup = async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) return res.status(400).json({ message: 'id and password required' });
  const exists = await User.findByPk(id);
  if (exists) return res.status(409).json({ message: 'User already exists' });
  const hash = await bcrypt.hash(password, 10);
  const { accessToken, refreshToken } = generateTokens(id);
  await User.create({ id, password: hash, refreshTokens: [refreshToken] });
  return res.json({ accessToken, refreshToken });
};

exports.signin = async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) return res.status(400).json({ message: 'id and password required' });
  const user = await User.findByPk(id);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const { accessToken, refreshToken } = generateTokens(id);
  user.refreshTokens = [...user.refreshTokens, refreshToken];
  await user.save();
  return res.json({ accessToken, refreshToken });
};

exports.newToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'No refresh token' });
  try {
    const payload = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const user = await User.findByPk(payload.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    // Удаляем старый refresh, добавляем новый
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    const { accessToken, refreshToken: newRefresh } = generateTokens(user.id);
    user.refreshTokens.push(newRefresh);
    await user.save();
    return res.json({ accessToken, refreshToken: newRefresh });
  } catch (e) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

exports.info = (req, res) => {
  return res.json({ id: req.user.id });
};

exports.logout = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];
  const { refreshToken } = req.body;
  if (!accessToken || !refreshToken) return res.status(400).json({ message: 'Tokens required' });
  // Добавляем оба токена в черный список
  const now = new Date();
  await TokenBlacklist.create({ token: accessToken, expiresAt: new Date(now.getTime() + 10*60*1000) });
  await TokenBlacklist.create({ token: refreshToken, expiresAt: new Date(now.getTime() + 24*60*60*1000) });
  // Удаляем refreshToken из пользователя
  const payload = jwt.decode(accessToken);
  const user = await User.findByPk(payload.id);
  if (user) {
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    await user.save();
  }
  return res.json({ message: 'Logged out' });
}; 