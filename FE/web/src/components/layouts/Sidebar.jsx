import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar({ role, menuItems }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <FaUserCircle size={36} />
        <span>{role}</span>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <item.icon /> {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}