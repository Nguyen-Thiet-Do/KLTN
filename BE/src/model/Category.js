const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  categoryId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    comment: 'Mã thể loại'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Tên thể loại không được để trống'
      }
    },
    comment: 'Tên thể loại'
  }
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: false,
});

module.exports = Category;
