const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  notificationId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  readerId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'readers',
      key: 'readerId'
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'normal'
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  emailSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  emailSentAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

module.exports = Notification;