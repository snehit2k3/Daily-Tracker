const express = require('express');
const { User } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// 🧠 Authenticated user data with streak logic
router.get('/data', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const todayStr = new Date().toISOString().split('T')[0];
    const lastLoginStr = user.lastLoginDate
      ? new Date(user.lastLoginDate).toISOString().split('T')[0]
      : null;

    if (lastLoginStr !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastLoginStr === yesterdayStr) {
        user.currentStreak += 1;
        if (user.currentStreak > user.longestStreak) {
          user.longestStreak = user.currentStreak;
        }
      } else {
        user.currentStreak = 1;
      }

      user.lastLoginDate = new Date(); // store as full Date object
      await user.save();
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
    });
  } catch (err) {
    console.error('❌ Error fetching user data:', err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;
