const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // <--- fixed here

const Rating = sequelize.define('Rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false }, // 0-10
}, {
  timestamps: true,
  tableName: 'ratings',
});

module.exports = Rating;