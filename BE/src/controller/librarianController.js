const librarianService = require("../service/librarianService");

// ✅ Lấy danh sách thủ thư
const getAllLibrarians = async (req, res) => {
  try {
    const librarians = await librarianService.getAllLibrarians();
    res.json({ success: true, librarians });
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách thủ thư:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Lấy thông tin thủ thư hiện tại
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

// ✅ Thêm thủ thư
const createLibrarian = async (req, res) => {
  try {
    const data = req.body;
    const result = await librarianService.createLibrarian(data);
    res.json({ success: true, message: "Thêm thủ thư thành công", librarian: result });
  } catch (err) {
    console.error("❌ Lỗi khi thêm thủ thư:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Sửa thủ thư
const updateLibrarian = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await librarianService.updateLibrarian(id, req.body);
    res.json({ success: true, message: "Cập nhật thủ thư thành công", result });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật thủ thư:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Xóa thủ thư
const deleteLibrarian = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await librarianService.deleteLibrarian(id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thủ thư." });
    }
    res.json({ success: true, message: "Đã xóa thủ thư thành công." });
  } catch (err) {
    console.error("❌ Lỗi khi xóa thủ thư:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllLibrarians,
  getCurrentLibrarian,
  createLibrarian,
  updateLibrarian,
  deleteLibrarian,
};
