const express = require('express');
const { Task } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// 🔐 Apply token middleware to all task routes
router.use(authenticateToken);

// 📥 GET tasks for a specific user and date
router.get('/', async (req, res) => {
  const userId = req.user.id;
  const date = req.query.date || new Date().toISOString().split('T')[0];

  try {
    const tasks = await Task.findAll({ where: { userId, date } });
    res.status(200).json(tasks);
  } catch (err) {
    console.error('❌ Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ➕ Create a new task
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { title, date } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }

  try {
    const task = await Task.create({ userId, title, date });
    res.status(201).json(task);
  } catch (err) {
    console.error('❌ Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// ✅ Update task completion status
router.put('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed field must be a boolean' });
  }

  try {
    const task = await Task.findOne({ where: { id, userId } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.completed = completed;
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error('❌ Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;
