// models/Librarian.js
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Librarian = sequelize.define(
  'Librarian',
  {
    librarianId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'accounts',
        key: 'accountId',
      },
    },

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'roleId',
      },
    },

    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    dateOfBirth: {
      type: DataTypes.DATEONLY, 
      allowNull: true,
    },

    gender: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    cccd: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    basicSalary: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    salaryCoefficient: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },

    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at',
    },
  },
  {
    tableName: 'librarians',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: false,
  }
);

module.exports = Librarian;
