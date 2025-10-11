import { Outlet } from "react-router-dom";
import Sidebar from "../../layouts/Sidebar";
import Topbar from "../../layouts/Topbar";
import { adminMenuItems } from "../../../config/adminMenuItems";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <Sidebar role="Admin" menuItems={adminMenuItems} />
      <main className="main">
        <Topbar />
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}