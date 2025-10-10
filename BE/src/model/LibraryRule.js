const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LibraryRule = sequelize.define('LibraryRule', {
  libraryRuleId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  nameRule: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  effectiveFrom: {
    type: DataTypes.DATE,
    allowNull: true
  },
  effectiveTo: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'library_rules',
  timestamps: true
});

module.exports = LibraryRule;