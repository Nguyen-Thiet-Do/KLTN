// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./LibrarianLayout.css";
// import {
//   FaUserCircle,
//   FaBook,
//   FaUsers,
//   FaExchangeAlt,
//   FaChartBar,
//   FaBell,
//   FaSearch,
// } from "react-icons/fa";

// export default function LibrarianLayout({ children }) {
//   const [now, setNow] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => setNow(new Date()), 1000 * 60);
//     return () => clearInterval(timer);
//   }, []);

//   const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   const date = now.toLocaleDateString("vi-VN");

//   return (
//     <div className="librarian-container">
//       {}
//       <aside className="sidebar">
//         <div className="sidebar-top">
//           <FaUserCircle size={36} />
//           <span>Thủ thư</span>
//         </div>

//         <nav>
//           <Link to="/documents">
//             <FaBook /> Tài liệu
//           </Link>
//           <Link to="/readers">
//             <FaUsers /> Độc giả
//           </Link>
//           <Link to="/borrow">
//             <FaExchangeAlt /> Mượn – Trả
//           </Link>
//           <Link to="/statistics">
//             <FaChartBar /> Thống kê
//           </Link>
//         </nav>
//       </aside>

//       {/* Main content */}
//       <main className="main">
//         {/* Topbar */}
//         <header className="topbar">
//           <div className="topbar-left">
//             <img src="/logo.png" alt="Logo" className="logo-img" />
//           </div>

//           <div className="search-bar">
//             <input type="text" placeholder="Tìm kiếm..." />
//             <FaSearch />
//           </div>

//           <div className="top-right">
//             <span className="datetime">{time} | {date}</span>
//             <FaBell className="icon" />
//             <FaUserCircle className="icon" />
//           </div>
//         </header>

//         {/* Page Content */}
//         <div className="content">{children || <h3>Trang chủ Thủ thư</h3>}</div>
//       </main>
//     </div>
//   );
// }


// src/layouts/LibrarianLayout.jsx
import { Link, Outlet } from "react-router-dom";
import { FaUserCircle, FaBookReader, FaBook, FaExchangeAlt, FaChartBar, FaBell, FaSearch } from "react-icons/fa";
import "./LibrarianLayout.css";

export default function LibrarianLayout() {
  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-top">
          <FaUserCircle size={36} />
          <span>Thủ thư</span>
        </div>
        <nav>
          <Link to="/librarian/documents"><FaBook /> Tài liệu</Link>
          <Link to="/librarian/borrow"><FaExchangeAlt /> Mượn trả</Link>
          <Link to="/librarian/readers"><FaBookReader /> Độc giả</Link>
          <Link to="/librarian/statistics"><FaChartBar /> Thống kê</Link>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left"><img src="/logo.png" alt="Logo" className="logo-img" /></div>
          <div className="search-bar"><input type="text" placeholder="Search" /><FaSearch /></div>
          <div className="top-right"><FaBell /><FaUserCircle /></div>
        </header>
        <div className="content">
          <Outlet /> {/* chỗ render page con */}
        </div>
      </main>
    </div>
  );
}
