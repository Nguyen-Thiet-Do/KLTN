// route/librarianRoutes.js
const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const sequelize = require("../config/database");

// Lấy thông tin thủ thư hiện tại
router.get("/me", requireAuth, requireRole([2]), async (req, res) => {
  try {
    console.log("📥 GET /api/librarian/me - accountId:", req.user.accountId);
    
    const accountId = req.user.accountId;

    // ✅ Sửa: Không dùng array destructure, lấy trực tiếp
    const results = await sequelize.query(`
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
    `, {
      replacements: [accountId],
      type: sequelize.QueryTypes.SELECT
    });

    console.log("📊 Query results:", results);

    if (!results || results.length === 0) {
      console.log("❌ Không tìm thấy librarian cho accountId:", accountId);
      return res.status(404).json({ 
        success: false, 
        message: "Không tìm thấy thủ thư" 
      });
    }

    const librarian = results[0];
    console.log("✅ Librarian found:", librarian.fullName);

    res.json({ 
      success: true, 
      librarian: librarian
    });
  } catch (err) {
    console.error("❌ Error in /api/librarian/me:", err);
    console.error("❌ Stack:", err.stack);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

module.exports = router;