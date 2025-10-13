import "./Librarians.css";
import { FaPlus, FaSearch, FaFilter, FaTrash, FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getLibrarians, deleteLibrarian } from "../../services/librarianService";
import AddLibrarian from "./AddLibrarian";
import EditLibrarian from "./EditLibrarian"; // 👈 import form sửa mới

export default function Librarians() {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLibrarian, setEditingLibrarian] = useState(null); // 👈 lưu đối tượng đang sửa

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      const data = await getLibrarians(token);
      if (data.success) setLibrarians(data.librarians);
      else setError("Không thể tải danh sách thủ thư.");
    } catch (err) {
      console.error("Chi tiết lỗi:", err.response || err);
      if (err.response?.status === 401) {
        setError("Token không hợp lệ hoặc đã hết hạn.");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
      } else {
        setError("Lỗi khi tải dữ liệu: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getGenderDisplay = (gender) => {
    if (gender && typeof gender === "object" && gender.type === "Buffer" && Array.isArray(gender.data)) {
      const value = gender.data[0];
      return value === 1 ? "Nam" : value === 0 ? "Nữ" : "-";
    }
    if (gender === 1 || gender === "1") return "Nam";
    if (gender === 0 || gender === "0") return "Nữ";
    return "-";
  };

  // 🗑️ Xóa thủ thư
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa thủ thư "${name}" không?`);
    if (!confirmed) return;

    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await deleteLibrarian(id, token);
      if (res.success) {
        alert("Đã xóa thủ thư thành công!");
        fetchData();
      } else alert(res.message || "Không thể xóa thủ thư.");
    } catch (err) {
      alert("Xóa thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="librarian-page">
      <h2>Quản lý Thủ thư</h2>

      <div className="librarian-toolbar">
        <button className="btn btn-list" onClick={fetchData}>
          Danh sách Thủ thư
        </button>
        <button className="btn btn-add" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Thêm Thủ thư mới
        </button>
      </div>

      <div className="librarian-search">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Tìm kiếm thủ thư" />
        </div>
        <FaFilter className="filter-icon" />
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="librarian-table">
          <table>
            <thead>
              <tr>
                <th>Mã thủ thư</th>
                <th>Họ tên</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Email</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {librarians.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                librarians.map((lib) => (
                  <tr key={lib.librarianId}>
                    <td>{lib.librarianCode || `TT${lib.librarianId}`}</td>
                    <td>{lib.fullName}</td>
                    <td>{getGenderDisplay(lib.gender)}</td>
                    <td>{lib.dateOfBirth ? new Date(lib.dateOfBirth).toLocaleDateString("vi-VN") : "-"}</td>
                    <td>{lib.email}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => setEditingLibrarian(lib)} // 👈 mở modal sửa
                      >
                        <FaEdit /> Sửa
                      </button>{" "}
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(lib.librarianId, lib.fullName)}
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ➕ Modal thêm thủ thư */}
      {showAddModal && (
        <AddLibrarian
          onSuccess={() => {
            setShowAddModal(false);
            fetchData();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* ✏️ Modal sửa thủ thư */}
      {editingLibrarian && (
        <EditLibrarian
          librarian={editingLibrarian}
          onSuccess={() => {
            setEditingLibrarian(null);
            fetchData();
          }}
          onCancel={() => setEditingLibrarian(null)}
        />
      )}
    </div>
  );
}
