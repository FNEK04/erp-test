const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true, // email или телефон
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshTokens: {
    type: DataTypes.JSON, // массив строк
    allowNull: false,
    defaultValue: [],
  },
}, {
  timestamps: true,
});

module.exports = User; 