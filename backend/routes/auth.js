const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validate, schemas } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// Register
router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    logger.info('User registered:', { userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Login
router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    logger.info('User logged in:', { userId: user.id, email: user.email });

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

module.exports = router;
