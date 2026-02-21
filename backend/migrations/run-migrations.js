require('dotenv').config();
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

const runMigrations = async () => {
  try {
    logger.info('Starting database migrations...');

    // Create tables
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('Created users table');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'todo',
        priority VARCHAR(50) NOT NULL DEFAULT 'medium',
        "dueDate" TIMESTAMP WITH TIME ZONE,
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CHECK (status IN ('todo', 'in_progress', 'done')),
        CHECK (priority IN ('low', 'medium', 'high'))
      );
    `);
    logger.info('Created tasks table');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY,
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('Created sessions table');

    // Create indexes
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks("userId");
    `);
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    `);
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions("userId");
    `);
    logger.info('Created indexes');

    logger.info('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
