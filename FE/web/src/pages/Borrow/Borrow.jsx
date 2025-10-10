import "./Borrow.css";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import { useState } from "react";

export default function Borrow() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="borrow-page">
      <h2>Quản lý Mượn - Trả</h2>

      {/* Thanh công cụ */}
      <div className="borrow-toolbar">
        <button className="btn btn-list">Danh sách Phiếu mượn</button>
        <button className="btn btn-add">
          <FaPlus /> Thêm Phiếu mượn
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div className="borrow-search">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Tìm kiếm phiếu mượn..." />
        </div>
        <FaFilter className="filter-icon" />
      </div>

      {/* Tabs */}
      <div className="borrow-tabs">
        {["all", "borrowed", "returned", "overdue"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "all" && "Tất cả"}
            {tab === "borrowed" && "Đang mượn"}
            {tab === "returned" && "Đã trả"}
            {tab === "overdue" && "Quá hạn"}
          </button>
        ))}
      </div>

      {/* Bảng dữ liệu */}
      <div className="borrow-table">
        <table>
          <thead>
            <tr>
              <th>ID Phiếu</th>
              <th>Độc giả</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* Phiếu 1 */}
            <tr className="borrow-row">
              <td>PM001</td>
              <td>Nguyễn Văn A</td>
              <td>01/10/2025</td>
              <td>15/10/2025</td>
              <td>Đang mượn</td>
              <td>-</td>
              <td>...</td>
            </tr>

            <tr className="sub-row">
              <td colSpan="7">
                <table className="sub-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vị trí kệ</th>
                      <th>Ngày nhập</th>
                      <th>Mã vạch</th>
                      <th>% Chất lượng</th>
                      <th>Trạng thái</th>
                      <th>Số lần mượn</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="8" className="no-data">
                        (Chưa có dữ liệu)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* Phiếu 2 */}
            <tr className="borrow-row">
              <td>PM002</td>
              <td>Trần Thị B</td>
              <td>02/10/2025</td>
              <td>18/10/2025</td>
              <td>Đã trả</td>
              <td>-</td>
              <td>...</td>
            </tr>

            <tr className="sub-row">
              <td colSpan="7">
                <table className="sub-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vị trí kệ</th>
                      <th>Ngày nhập</th>
                      <th>Mã vạch</th>
                      <th>% Chất lượng</th>
                      <th>Trạng thái</th>
                      <th>Số lần mượn</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="8" className="no-data">
                        (Chưa có dữ liệu)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
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
