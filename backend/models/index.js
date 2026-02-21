const { sequelize } = require('../config/database');
const UserModel = require('./User');
const TaskModel = require('./Task');
const SessionModel = require('./Session');

const User = UserModel(sequelize);
const Task = TaskModel(sequelize);
const Session = SessionModel(sequelize);

// Define associations
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' });
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Task,
  Session
};
