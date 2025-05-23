const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const taskRoutes = require('./routes/tasks');
const ratingRoutes = require('./routes/rating');
const userRoutes = require('./routes/user');

const sequelize = require('./config/db');
const verifyToken = require('./middleware/authenticateToken'); // JWT middleware

dotenv.config();
const app = express();

const allowedOrigins = [
  'https://daily-tracker.vercel.app',
  'https://daily-tracker-git-main-snehit-s-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 📦 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔐 Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);
app.use('/api/tasks', verifyToken, taskRoutes);
app.use('/api/ratings', verifyToken, ratingRoutes);
app.use('/api/user', verifyToken, userRoutes);

// ✅ Health check
app.get('/health', (req, res) => res.send('API is running'));

// 🚀 Port setup
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
