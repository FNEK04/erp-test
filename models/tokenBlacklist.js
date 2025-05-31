const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = TokenBlacklist; 