const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Import model classes
const User = require('./User');
const Task = require('./Task');
const Rating = require('./Rating');

// Initialize models (define schema here for User and Task only)
User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

Task.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'Task',
  tableName: 'tasks',
  timestamps: true,
});

// ⛔️ DO NOT redefine Rating here — it's already defined in models/Rating.js

// Set up associations
User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Task,
  Rating,
};
