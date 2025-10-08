import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import "./AdminLayout.css";
import {
  FaUserCircle,
  FaBookReader,
  FaUserTie,
  FaBook,
  FaExchangeAlt,
  FaChartBar,
  FaBell,
  FaSearch,
} from "react-icons/fa";

export default function AdminLayout({ children }) {
  
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 60); // mỗi phút
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("vi-VN");

  return (
    <div className="admin-container">
      {}
      <aside className="sidebar">
        <div className="sidebar-top">
          <FaUserCircle size={36} />
          <span>Admin</span>
        </div>

       <nav>
  <Link to="/readers">
    <FaBookReader /> Độc giả
  </Link>
  <Link to="/librarians">
    <FaUserTie /> Thủ thư
  </Link>
  <Link to="/documents">
    <FaBook /> Tài liệu
  </Link>
  <Link to="/borrow">
    <FaExchangeAlt /> Mượn trả
  </Link>
  <Link to="/statistics">
    <FaChartBar /> Thống kê
  </Link>
</nav>

      </aside>

      {}
      <main className="main">
        {}
        <header className="topbar">
          <div className="topbar-left">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <FaSearch />
          </div>

          <div className="top-right">
            <span className="datetime">{time} | {date}</span>
            <FaBell className="icon" />
            <FaUserCircle className="icon" />
          </div>
        </header>

        {}
        <div className="content">{children || <h3>Home admin page</h3>}</div>
      </main>
    </div>
  );
}
