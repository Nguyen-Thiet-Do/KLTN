import "./Librarians.css";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Librarians() {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibrarians = async () => {
      try {
        // ✅ Đổi từ localStorage sang sessionStorage
        const token = sessionStorage.getItem("accessToken");
        
        // ✅ Kiểm tra token có tồn tại không
        if (!token) {
          setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }

        console.log("Token:", token); // Debug

        const res = await axios.get("http://localhost:8080/api/librarian", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setLibrarians(res.data.librarians);
        } else {
          setError("Không thể tải danh sách thủ thư");
        }
      } catch (err) {
        console.error("Chi tiết lỗi:", err.response || err);
        
        // ✅ Xử lý lỗi 401 (Unauthorized)
        if (err.response?.status === 401) {
          setError("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          // Uncomment dòng dưới nếu muốn tự động chuyển về trang login
          // window.location.href = "/login";
        } else {
          setError("Lỗi khi tải dữ liệu: " + (err.response?.data?.message || err.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLibrarians();
  }, []);

  return (
    <div className="librarian-page">
      <h2>Quản lý Thủ thư</h2>

      {/* Thanh công cụ */}
      <div className="librarian-toolbar">
        <button className="btn btn-list">Danh sách Thủ thư</button>
        <button className="btn btn-add">
          <FaPlus /> Thêm Thủ thư mới
        </button>
      </div>

      {/* Ô tìm kiếm */}
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
              {/* ✅ Thêm kiểm tra mảng rỗng */}
              {librarians.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: "center"}}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                librarians.map((lib) => (
                  <tr key={lib.librarianCode || lib.librarianId}>
                    <td>{lib.librarianCode || `TT${lib.librarianId}`}</td>
                    <td>{lib.fullName}</td>
                    <td>{lib.gender === 1 ? "Nam" : lib.gender === 0 ? "Nữ" : "-"}</td>
                    <td>{lib.dateOfBirth ? new Date(lib.dateOfBirth).toLocaleDateString("vi-VN") : "-"}</td>
                    <td>{lib.email}</td>
                    <td><button className="btn-edit">Sửa</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}