const express = require('express');
const { sequelize } = require('../config/database');
const { checkRedisHealth } = require('../config/redis');

const router = express.Router();

// Prometheus-compatible metrics endpoint
router.get('/', async (req, res) => {
  try {
    let dbConnected = 0;
    let redisConnected = 0;

    try {
      await sequelize.authenticate();
      dbConnected = 1;
    } catch (error) {
      dbConnected = 0;
    }

    const redisStatus = await checkRedisHealth();
    redisConnected = redisStatus ? 1 : 0;

    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    const metrics = `# HELP taskmanager_up Application running status
# TYPE taskmanager_up gauge
taskmanager_up 1

# HELP taskmanager_uptime_seconds Application uptime in seconds
# TYPE taskmanager_uptime_seconds counter
taskmanager_uptime_seconds ${uptime.toFixed(2)}

# HELP taskmanager_database_connected Database connection status
# TYPE taskmanager_database_connected gauge
taskmanager_database_connected ${dbConnected}

# HELP taskmanager_redis_connected Redis connection status
# TYPE taskmanager_redis_connected gauge
taskmanager_redis_connected ${redisConnected}

# HELP taskmanager_memory_heap_used_bytes Memory heap used in bytes
# TYPE taskmanager_memory_heap_used_bytes gauge
taskmanager_memory_heap_used_bytes ${memoryUsage.heapUsed}

# HELP taskmanager_memory_heap_total_bytes Memory heap total in bytes
# TYPE taskmanager_memory_heap_total_bytes gauge
taskmanager_memory_heap_total_bytes ${memoryUsage.heapTotal}

# HELP taskmanager_memory_rss_bytes Resident set size in bytes
# TYPE taskmanager_memory_rss_bytes gauge
taskmanager_memory_rss_bytes ${memoryUsage.rss}
`;

    res.set('Content-Type', 'text/plain; version=0.0.4');
    res.send(metrics);
  } catch (error) {
    res.status(500).send('# Error generating metrics\n');
  }
});

module.exports = router;
