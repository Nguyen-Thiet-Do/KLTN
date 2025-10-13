import { useState } from "react";
import { updateLibrarian } from "../../services/librarianService";
import "./AddLibrarian.css"; // dùng lại style của form thêm

export default function EditLibrarian({ librarian, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    fullName: librarian.fullName || "",
    gender: librarian.gender?.data?.[0] ?? librarian.gender ?? 0,
    dateOfBirth: librarian.dateOfBirth?.split("T")[0] || "",
    address: librarian.address || "",
    note: librarian.note || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = sessionStorage.getItem("accessToken");
      const res = await updateLibrarian(librarian.librarianId, form, token);
      if (res.success) {
        alert("Cập nhật thông tin thủ thư thành công!");
        onSuccess();
      } else alert(res.message || "Không thể cập nhật.");
    } catch (err) {
      alert("Lỗi khi cập nhật: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Sửa thông tin Thủ thư</h3>
        <form onSubmit={handleSubmit}>
          <label>Họ tên</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} required />

          <label>Giới tính</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="1">Nam</option>
            <option value="0">Nữ</option>
          </select>

          <label>Ngày sinh</label>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />

          <label>Địa chỉ</label>
          <input name="address" value={form.address} onChange={handleChange} />

          <label>Ghi chú</label>
          <textarea name="note" value={form.note} onChange={handleChange} />

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button type="button" onClick={onCancel}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
