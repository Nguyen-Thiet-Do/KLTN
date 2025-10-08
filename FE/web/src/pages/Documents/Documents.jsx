import AdminLayout from "../../layouts/AdminLayout";
import "./Documents.css";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import { useState } from "react";

export default function Documents() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <AdminLayout>
      <div className="docs-page">
        <h2>Quản lý Tài liệu</h2>

        {/* Thanh công cụ */}
        <div className="docs-toolbar">
          <button className="btn btn-list">Danh sách Tài liệu</button>
          <button className="btn btn-add">
            <FaPlus /> Thêm Tài liệu mới
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="docs-search">
          <div className="search-box">
            <FaSearch />
            <input type="text" placeholder="Tìm kiếm tài liệu..." />
          </div>
          <FaFilter className="filter-icon" />
        </div>

        {/* Tabs */}
        <div className="docs-tabs">
          {["all", "paid", "unpaid", "overdue"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all" && "All"}
              {tab === "paid" && "Paid"}
              {tab === "unpaid" && "Unpaid"}
              {tab === "overdue" && "Overdue"}
            </button>
          ))}
        </div>

        {/* Bảng dữ liệu (chưa có dữ liệu thật) */}
        <div className="docs-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Thể loại</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Ngôn ngữ</th>
                <th>NXB</th>
                <th>Giá bìa</th>
                <th>Ebook</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="9" className="no-data">
                  (Chưa có dữ liệu)
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
    </AdminLayout>
  );
}
