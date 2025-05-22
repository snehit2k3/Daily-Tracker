const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  currentStreak: { type: DataTypes.INTEGER, defaultValue: 0 },
  longestStreak: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastLoginDate: { type: DataTypes.DATEONLY, allowNull: true },
});

module.exports = User;
