import "./Readers.css";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";

export default function Readers() {
  return (
    <div className="readers-page">
      <h2>Quản lý độc giả</h2>

      {/* Thanh công cụ */}
      <div className="reader-toolbar">
        <button className="btn btn-list">Danh sách Độc giả</button>
        <button className="btn btn-add">
          <FaPlus /> Thêm Độc giả mới
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div className="reader-search">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Tìm kiếm độc giả" />
        </div>
        <FaFilter className="filter-icon" />
      </div>

      {/* Bảng dữ liệu */}
      <div className="reader-table">
        <table>
          <thead>
            <tr>
              <th>Mã độc giả</th>
              <th>Họ tên</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DG001</td>
              <td>Nguyễn Văn A</td>
              <td>Nam</td>
              <td>12/03/2000</td>
              <td>a@gmail.com</td>
              <td><button className="btn-edit">Sửa</button></td>
            </tr>
            <tr>
              <td>DG002</td>
              <td>Trần Thị B</td>
              <td>Nữ</td>
              <td>05/08/1999</td>
              <td>b@gmail.com</td>
              <td><button className="btn-edit">Sửa</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="pagination">
        <button>Previous</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <span>...</span>
        <button>Next</button>
      </div>
    </div>
  );
}
