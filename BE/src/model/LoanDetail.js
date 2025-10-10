const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoanDetail = sequelize.define('LoanDetail', {
  loanDetailId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  loanSlipId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'loan_slips',
      key: 'loanSlipId'
    }
  },
  documentCopyId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'document_copies',
      key: 'documentCopyId'
    }
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  conditionBorrow: {
    type: DataTypes.STRING,
    allowNull: true
  },
  photoBeforeBorrow: {
    type: DataTypes.STRING,
    allowNull: true
  },
  conditionReturn: {
    type: DataTypes.STRING,
    allowNull: true
  },
  photoAfterReturn: {
    type: DataTypes.STRING,
    allowNull: true
  },
  depositAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  fineAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  renewalCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'borrowed'
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'loan_details',
  timestamps: true
});

module.exports = LoanDetail;