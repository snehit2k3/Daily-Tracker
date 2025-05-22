const express = require('express');
const { Task } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  const userId = req.user.id;
  const date = req.query.date || new Date().toISOString().split('T')[0];

  try {
    const tasks = await Task.findAll({ where: { userId, date } });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { title, date } = req.body;

  try {
    const task = await Task.create({ userId, title, date });
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const task = await Task.findOne({ where: { id, userId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.completed = completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;
