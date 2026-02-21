const { createClient } = require('redis');
const logger = require('../utils/logger');

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    return null;
  }
};

const getRedisClient = () => redisClient;

const checkRedisHealth = async () => {
  try {
    if (!redisClient || !redisClient.isOpen) {
      return false;
    }
    await redisClient.ping();
    return true;
  } catch (error) {
    logger.error('Redis health check failed:', error);
    return false;
  }
};

module.exports = { connectRedis, getRedisClient, checkRedisHealth };
