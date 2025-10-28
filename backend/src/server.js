const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Malloca API is running!' });
});

// Test database connection
app.use('/api', routes);

// ✅ Test kết nối DB (đặt ở đây)
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'Error', database: 'Disconnected' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

module.exports = app;