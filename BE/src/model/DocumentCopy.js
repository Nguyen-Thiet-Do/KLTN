const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DocumentCopy = sequelize.define('DocumentCopy', {
  documentCopyId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  documentId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'documents',
      key: 'documentId'
    }
  },
  barCode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  shelfLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'available'
  },
  conditionNote: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  entryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  conditionGrade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numberBorrow: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'document_copies',
  timestamps: true
});

module.exports = DocumentCopy;