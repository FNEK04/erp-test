const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  extension: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  uploadDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = File; 