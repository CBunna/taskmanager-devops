const express = require('express');
const { Task } = require('../models');
const authMiddleware = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all tasks for current user
router.get('/', async (req, res) => {
  try {
    const { status, priority } = req.query;

    const where = { userId: req.userId };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const tasks = await Task.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    logger.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error('Get task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
});

// Create task
router.post('/', validate(schemas.createTask), async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.userId
    });

    logger.info('Task created:', { taskId: task.id, userId: req.userId });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error('Create task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

// Update task
router.put('/:id', validate(schemas.updateTask), async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    await task.update(req.body);

    logger.info('Task updated:', { taskId: task.id, userId: req.userId });

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error('Update task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    await task.destroy();

    logger.info('Task deleted:', { taskId: req.params.id, userId: req.userId });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
});

module.exports = router;
