const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const librarianController = require("../controller/librarianController");

// ✅ Lấy danh sách tất cả thủ thư (chỉ admin được phép)
router.get("/", requireAuth, requireRole([1]), librarianController.getAllLibrarians);

// ✅ Lấy thông tin thủ thư hiện tại (dành cho thủ thư)
router.get("/me", requireAuth, requireRole([2]), librarianController.getCurrentLibrarian);

module.exports = router;
