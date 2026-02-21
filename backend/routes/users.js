const express = require('express');
const { User } = require('../models');
const authMiddleware = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user.toJSON()
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// Update current user profile
router.put('/me', validate(schemas.updateUser), async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use'
        });
      }
    }

    await req.user.update({
      firstName: firstName || req.user.firstName,
      lastName: lastName || req.user.lastName,
      email: email || req.user.email
    });

    logger.info('Profile updated:', { userId: req.userId });

    res.json({
      success: true,
      data: req.user.toJSON()
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

module.exports = router;
