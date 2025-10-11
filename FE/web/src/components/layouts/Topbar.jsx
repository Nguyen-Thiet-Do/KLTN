import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import "./Topbar.css";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <img src="/logo.png" alt="Logo" className="logo-img" />
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search" />
        <FaSearch />
      </div>
      <div className="top-right">
        <FaBell />
        <FaUserCircle />
      </div>
    </header>
  );
}