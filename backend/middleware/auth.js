const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findByPk(decoded.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      req.user = user;
      req.userId = user.id;
      next();
    } catch (jwtError) {
      logger.warn('Invalid token:', jwtError.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

module.exports = authMiddleware;
