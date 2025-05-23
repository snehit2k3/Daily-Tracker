const express = require('express');
const { Rating } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// 🔐 Apply JWT auth middleware to all rating routes
router.use(authenticateToken);

// 📥 GET rating for a specific user and date
router.get('/', async (req, res) => {
  const userId = req.user.id;
  const date = req.query.date || new Date().toISOString().split('T')[0];

  try {
    const ratingRecord = await Rating.findOne({ where: { userId, date } });
    res.status(200).json(ratingRecord || { rating: null });
  } catch (error) {
    console.error('❌ Error fetching rating:', error);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
});

// 📤 POST or UPDATE rating
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { rating, date } = req.body;

  if (!rating) {
    return res.status(400).json({ error: 'Rating value is required' });
  }

  const ratingDate = date || new Date().toISOString().split('T')[0];

  try {
    const [ratingRecord, created] = await Rating.findOrCreate({
      where: { userId, date: ratingDate },
      defaults: { rating, date: ratingDate, userId }
    });

    if (!created) {
      ratingRecord.rating = rating;
      await ratingRecord.save();
    }

    res.status(200).json(ratingRecord);
  } catch (error) {
    console.error('❌ Error saving rating:', error);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

module.exports = router;
