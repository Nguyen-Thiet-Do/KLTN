const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
  documentId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true
  },
  publicationYear: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  edition: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pageCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  coverPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  coverPhoto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ebookUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'categoryId'
    }
  },
  numberOfCopy: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'documents',
  timestamps: true
});

module.exports = Document;