const librarianService = require("../service/librarianService");

// ✅ Lấy danh sách thủ thư cho Admin
const getAllLibrarians = async (req, res) => {
  try {
    const librarians = await librarianService.getAllLibrarians();
    res.json({ success: true, librarians });
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách thủ thư:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Lấy thông tin thủ thư hiện tại (đã có)
const getCurrentLibrarian = async (req, res) => {
  try {
    const accountId = req.user.accountId;
    const librarian = await librarianService.getLibrarianByAccountId(accountId);

    if (!librarian)
      return res.status(404).json({ success: false, message: "Không tìm thấy thủ thư" });

    res.json({ success: true, librarian });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllLibrarians, getCurrentLibrarian };
