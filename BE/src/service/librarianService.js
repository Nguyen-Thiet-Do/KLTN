const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

// ============================================================
// 🔹 LẤY DANH SÁCH TẤT CẢ THỦ THƯ
// ============================================================
const getAllLibrarians = async () => {
  const [results] = await sequelize.query(`
    SELECT 
      l.librarianId,
      l.fullName,
      l.dateOfBirth,
      l.gender,
      l.address,
      l.note,
      a.email
    FROM librarians l
    JOIN accounts a ON l.accountId = a.accountId
    ORDER BY l.librarianId ASC
  `);
  return results;
};

// ============================================================
// 🔹 LẤY THÔNG TIN THỦ THƯ THEO ACCOUNT ID
// ============================================================
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

// ============================================================
// 🔹 THÊM THỦ THƯ MỚI (CHO ADMIN)
// ============================================================
const createLibrarian = async (data) => {
  const {
    fullName,
    email,
    password,
    gender,
    dateOfBirth,
    phoneNumber,
    address,
    note,
  } = data;

  if (!fullName || !email || !password) {
    throw new Error("Thiếu thông tin bắt buộc (fullName, email, password)");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Thêm tài khoản
    const [accountInsert] = await sequelize.query(
      `
      INSERT INTO accounts (email, phoneNumber, passwordHash, status, roleId, created_at, updated_at)
      VALUES (?, ?, ?, 1, 2, NOW(), NOW())
      `,
      {
        replacements: [email, phoneNumber || null, passwordHash],
        transaction,
      }
    );

    const accountId =
      accountInsert?.insertId ||
      accountInsert?.[0]?.insertId ||
      accountInsert;

    // 2️⃣ Thêm thủ thư
    const [libInsert] = await sequelize.query(
      `
      INSERT INTO librarians 
      (accountId, roleId, fullName, dateOfBirth, gender, address, note, hireDate, created_at, updated_at)
      VALUES (?, 2, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
      `,
      {
        replacements: [
          accountId,
          fullName,
          dateOfBirth || null,
          gender || null,
          address || null,
          note || null,
        ],
        transaction,
      }
    );

    const librarianId =
      libInsert?.insertId ||
      libInsert?.[0]?.insertId ||
      libInsert;

    await transaction.commit();

    return { librarianId, accountId, fullName, email };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

// ============================================================
// 🔹 CẬP NHẬT THÔNG TIN THỦ THƯ (CHO ADMIN)
// ============================================================
const updateLibrarian = async (id, data) => {
  const { fullName, gender, dateOfBirth, address, note } = data;

  const [result] = await sequelize.query(
    `
    UPDATE librarians
    SET fullName = ?, gender = ?, dateOfBirth = ?, address = ?, note = ?, updated_at = NOW()
    WHERE librarianId = ?
    `,
    {
      replacements: [
        fullName || null,
        gender ?? null,
        dateOfBirth || null,
        address || null,
        note || null,
        id,
      ],
    }
  );

  return { affectedRows: result.affectedRows || result };
};

// ============================================================
// 🗑️ XÓA THỦ THƯ (XÓA CẢ ACCOUNT LIÊN KẾT)
// ============================================================
const deleteLibrarian = async (librarianId) => {
  const transaction = await sequelize.transaction();
  try {
    const [[lib]] = await sequelize.query(
      `SELECT accountId FROM librarians WHERE librarianId = ?`,
      { replacements: [librarianId], transaction }
    );

    if (!lib) {
      await transaction.rollback();
      return false;
    }

    await sequelize.query(`DELETE FROM librarians WHERE librarianId = ?`, {
      replacements: [librarianId],
      transaction,
    });

    await sequelize.query(`DELETE FROM accounts WHERE accountId = ?`, {
      replacements: [lib.accountId],
      transaction,
    });

    await transaction.commit();
    return true;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

module.exports = {
  getAllLibrarians,
  getLibrarianByAccountId,
  createLibrarian,
  updateLibrarian,
  deleteLibrarian,
};
