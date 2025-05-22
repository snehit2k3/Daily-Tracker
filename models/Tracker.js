const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Tracker = sequelize.define('Tracker', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  mood: DataTypes.STRING,
  productivity: DataTypes.INTEGER,
  tasks: DataTypes.TEXT
});

User.hasMany(Tracker);
Tracker.belongsTo(User);

module.exports = Tracker;
