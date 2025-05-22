const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: Sequelize.NOW // <-- Added default value
  },
}, {
  timestamps: true,
  tableName: 'tasks',
});

module.exports = Task;
'['