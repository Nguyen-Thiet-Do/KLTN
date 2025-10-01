const databaseConnection = require('../config/database');

async function getAll() {
  const [rows] = await databaseConnection.query('SELECT * FROM categories');
  return rows;
}

module.exports = { getAll };