require('dotenv').config();
const { User, Task } = require('../models');
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

const seedData = async () => {
  try {
    logger.info('Starting database seeding...');

    // Create demo users
    const user1 = await User.create({
      email: 'john@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });
    logger.info('Created user: john@example.com');

    const user2 = await User.create({
      email: 'jane@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith'
    });
    logger.info('Created user: jane@example.com');

    // Create demo tasks for user1
    await Task.bulkCreate([
      {
        title: 'Setup development environment',
        description: 'Install Node.js, PostgreSQL, and Redis',
        status: 'done',
        priority: 'high',
        userId: user1.id,
        dueDate: new Date('2024-01-15')
      },
      {
        title: 'Review pull requests',
        description: 'Review and merge pending PRs',
        status: 'in_progress',
        priority: 'medium',
        userId: user1.id,
        dueDate: new Date('2024-02-01')
      },
      {
        title: 'Write API documentation',
        description: 'Document all REST endpoints',
        status: 'todo',
        priority: 'low',
        userId: user1.id,
        dueDate: new Date('2024-02-15')
      },
      {
        title: 'Fix authentication bug',
        description: 'Users unable to login with special characters in password',
        status: 'in_progress',
        priority: 'high',
        userId: user1.id,
        dueDate: new Date('2024-01-30')
      }
    ]);
    logger.info('Created tasks for john@example.com');

    // Create demo tasks for user2
    await Task.bulkCreate([
      {
        title: 'Design new landing page',
        description: 'Create wireframes and mockups',
        status: 'todo',
        priority: 'medium',
        userId: user2.id,
        dueDate: new Date('2024-02-10')
      },
      {
        title: 'Update user dashboard',
        description: 'Add analytics widgets',
        status: 'in_progress',
        priority: 'high',
        userId: user2.id,
        dueDate: new Date('2024-01-28')
      }
    ]);
    logger.info('Created tasks for jane@example.com');

    logger.info('Seeding completed successfully');
    logger.info('Demo credentials:');
    logger.info('  john@example.com / password123');
    logger.info('  jane@example.com / password123');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
