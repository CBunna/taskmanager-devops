const express = require('express');
const { sequelize } = require('../config/database');
const { checkRedisHealth } = require('../config/redis');

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  const startTime = Date.now();

  try {
    let dbStatus = false;
    let redisStatus = false;

    try {
      await sequelize.authenticate();
      dbStatus = true;
    } catch (error) {
      dbStatus = false;
    }

    redisStatus = await checkRedisHealth();

    const responseTime = Date.now() - startTime;

    const health = {
      status: dbStatus && redisStatus ? 'healthy' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db: dbStatus ? 'connected' : 'disconnected',
      redis: redisStatus ? 'connected' : 'disconnected',
      responseTime: `${responseTime}ms`
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;

    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;
