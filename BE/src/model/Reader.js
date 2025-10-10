const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reader = sequelize.define('Reader', {
  readerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'accounts',
      key: 'accountId'
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'roleId'
    }
  },
  fullName: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  gender: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },

  cccd: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  totalBorrow: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  note: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'readers',
  timestamps: false
});

module.exports = Reader;