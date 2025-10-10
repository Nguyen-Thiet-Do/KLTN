const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Renewal = sequelize.define('Renewal', {
  renewalId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  loanDetailId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'loan_details',
      key: 'loanDetailId'
    }
  },
  oldDueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  newDueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  librarianId: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: 'librarians',
      key: 'librarianId'
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  tableName: 'renewals',
  timestamps: true
});

module.exports = Renewal;