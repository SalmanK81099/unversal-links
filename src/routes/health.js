const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'deep-linking',
  });
});

router.get('/ready', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;
    const isDbConnected = dbState === 1;

    if (!isDbConnected) {
      throw new Error('Database not connected');
    }

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'connected',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

module.exports = router;
