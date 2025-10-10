const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Violation = sequelize.define('Violation', {
  violationId: {
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
  loanDetailId: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: 'loan_details',
      key: 'loanDetailId'
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  violationDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  photoProof: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fineAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'unpaid'
  },
  librarianId: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: 'librarians',
      key: 'librarianId'
    }
  },
  handledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'violations',
  timestamps: true
});

module.exports = Violation;