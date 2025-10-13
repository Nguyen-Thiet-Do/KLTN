const sequelize = require("../config/database");

// ✅ Lấy danh sách thủ thư
const getAllLibrarians = async () => {
  const [results] = await sequelize.query(`
    SELECT 
      l.librarianId,
      l.fullName,
      l.dateOfBirth,
      l.gender,
      a.email
    FROM librarians l
    JOIN accounts a ON l.accountId = a.accountId
    ORDER BY l.librarianId ASC
  `);
  return results;
};

const getLibrarianByAccountId = async (accountId) => {
  const [results] = await sequelize.query(
    `
    SELECT 
      l.librarianId, 
      l.fullName, 
      l.hireDate, 
      l.cccd, 
      l.address,
      l.basicSalary, 
      l.salaryCoefficient, 
      l.note,
      l.dateOfBirth,
      l.gender,
      a.email, 
      a.phoneNumber, 
      a.status
    FROM librarians l
    JOIN accounts a ON l.accountId = a.accountId
    WHERE l.accountId = ?
    `,
    { replacements: [accountId] }
  );
  return results[0];
};

module.exports = { getAllLibrarians, getLibrarianByAccountId };
