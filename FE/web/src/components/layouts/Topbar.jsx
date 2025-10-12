import { FaBell, FaSearch } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import { LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Gọi API logout từ backend
      await authService.logout();
      
      // Xóa dữ liệu và logout
      logout();
      setIsDropdownOpen(false);
      
      // Chuyển hướng về login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Nếu API lỗi, vẫn logout cục bộ
      logout();
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

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
        <button className="icon-button">
          <FaBell />
        </button>

        {/* User Dropdown */}
        <div className="user-dropdown-wrapper" ref={dropdownRef}>
          <button
            className="user-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="user-avatar">{userInitials}</div>
            <div className="user-info">
              <div className="user-name">{user?.name || "User"}</div>
              <div className="user-role">{user?.role || "Guest"}</div>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-avatar">{userInitials}</div>
                <div className="dropdown-user-info">
                  <div className="dropdown-name">{user?.name || "User"}</div>
                  <div className="dropdown-email">{user?.email || ""}</div>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <button className="dropdown-item">
                <User size={16} />
                <span>Profile</span>
              </button>

              <button className="dropdown-item">
                <Settings size={16} />
                <span>Settings</span>
              </button>

              <div className="dropdown-divider"></div>

              <button 
                className="dropdown-item logout-item" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut size={16} />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}