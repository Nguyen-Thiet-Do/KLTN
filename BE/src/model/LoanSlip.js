const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoanSlip = sequelize.define('LoanSlip', {
  loanSlipId: {
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
  librarianId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'librarians',
      key: 'librarianId'
    }
  },
  loanDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active'
  },
  receiveAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  borrowForm: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressForm: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'loan_slips',
  timestamps: true
});

module.exports = LoanSlip;