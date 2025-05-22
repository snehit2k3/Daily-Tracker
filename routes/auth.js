const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: null
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const lastLoginDate = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = user.currentStreak || 0;
    let longestStreak = user.longestStreak || 0;

    if (!lastLoginDate) {
      currentStreak = 1;
    } else {
      const lastLoginMidnight = new Date(lastLoginDate);
      lastLoginMidnight.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - lastLoginMidnight.getTime();
      const oneDay = 24 * 60 * 60 * 1000;

      if (diffTime === oneDay) {
        currentStreak += 1;
      } else if (diffTime > oneDay) {
        currentStreak = 1;
      }
      // If diffTime < oneDay, same-day login — streak remains unchanged
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    user.currentStreak = currentStreak;
    user.longestStreak = longestStreak;
    user.lastLoginDate = new Date();
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({
      message: 'Login successful',
      id: user.id,
      username: user.username,
      currentStreak,
      longestStreak,
      token
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
