import AdminLayout from "../../layouts/AdminLayout";
import "./Librarians.css";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";

export default function Librarians() {
  return (
    <AdminLayout>
      <div className="librarian-page">
        <h2>Quản lý Thủ thư</h2>

        {}
        <div className="librarian-toolbar">
          <button className="btn btn-list">Danh sách Thủ thư</button>
          <button className="btn btn-add">
            <FaPlus /> Thêm Thủ thư mới
          </button>
        </div>

        {}
        <div className="librarian-search">
          <div className="search-box">
            <FaSearch />
            <input type="text" placeholder="Tìm kiếm thủ thư" />
          </div>
          <FaFilter className="filter-icon" />
        </div>

        {}
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
              <tr>
                <td>TT001</td>
                <td>Nguyễn Thị Hương</td>
                <td>Nữ</td>
                <td>22/05/1998</td>
                <td>huong@example.com</td>
                <td><button className="btn-edit">Sửa</button></td>
              </tr>
              <tr>
                <td>TT002</td>
                <td>Trần Văn Bảo</td>
                <td>Nam</td>
                <td>10/09/1995</td>
                <td>bao@example.com</td>
                <td><button className="btn-edit">Sửa</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        {}
        <div className="pagination">
          <button>Previous</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <span>...</span>
          <button>Next</button>
        </div>
      </div>
    </AdminLayout>
  );
}
