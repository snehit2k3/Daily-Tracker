const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const taskRoutes = require('./routes/tasks');
const ratingRoutes = require('./routes/rating');
const userRoutes = require('./routes/user');

const sequelize = require('./config/db');
const verifyToken = require('./middleware/authenticateToken'); // your JWT middleware

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

// Protect dashboard routes with verifyToken middleware
app.use('/api/dashboard', verifyToken, dashboardRoutes);

// Protect task routes
app.use('/api/tasks', verifyToken, taskRoutes);

// Protect rating routes
app.use('/api/ratings', verifyToken, ratingRoutes);

// Protect user routes
app.use('/api/user', verifyToken, userRoutes);

app.get('/health', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ DB connected and synced');
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    console.error('❌ DB connection failed:', err);
  }
});
