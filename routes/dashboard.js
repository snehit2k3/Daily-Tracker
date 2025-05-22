const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Rating = require('../models/Rating');
const User = require('../models/User');
const verifyToken = require('../middleware/authenticateToken');

// 1. Get dashboard summary (today's tasks, rating, streak)
router.get('/summary', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const tasksToday = await Task.findAll({ where: { userId, date: today } });
    const ratingToday = await Rating.findOne({ where: { userId, date: today } });
    const user = await User.findByPk(userId);

    res.json({
      tasksToday,
      tasksCompleted: tasksToday.filter(t => t.completed).length,
      ratingToday: ratingToday?.rating || null,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

// 2. Add or update rating
router.post('/rating', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { rating } = req.body;
  const today = new Date().toISOString().split('T')[0];

  try {
    const [record, created] = await Rating.upsert({
      userId,
      date: today,
      rating,
    });

    res.json({ message: created ? 'Rating added' : 'Rating updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving rating' });
  }
});

// 3. Add a new task
router.post('/task', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { title } = req.body;
  const today = new Date().toISOString().split('T')[0];

  try {
    const newTask = await Task.create({ userId, title, date: today });
    res.json({ message: 'Task created', task: newTask });
  } catch (err) {
    res.status(500).json({ error: 'Error creating task' });
  }
});

// 4. Mark task as complete
router.put('/task/:taskId/complete', verifyToken, async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.completed = true;
    await task.save();

    res.json({ message: 'Task marked as complete' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

// 5. Get task and rating history (for graph)
router.get('/history', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const ratings = await Rating.findAll({ where: { userId }, order: [['date', 'ASC']] });
    const tasks = await Task.findAll({ where: { userId }, order: [['date', 'ASC']] });

    const taskCountByDate = tasks.reduce((acc, t) => {
      acc[t.date] = (acc[t.date] || 0) + (t.completed ? 1 : 0);
      return acc;
    }, {});

    const ratingData = ratings.map(r => ({ date: r.date, rating: r.rating }));
    const taskData = Object.keys(taskCountByDate).map(date => ({ date, completed: taskCountByDate[date] }));

    res.json({ ratingData, taskData });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching history' });
  }
});

module.exports = router;
