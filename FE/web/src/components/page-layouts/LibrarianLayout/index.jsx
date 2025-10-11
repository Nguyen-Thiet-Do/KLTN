import { Outlet } from "react-router-dom";
import Sidebar from "../../layouts/Sidebar";
import Topbar from "../../layouts/Topbar";
import { librarianMenuItems } from "../../../config/librarianMenuItems";
import "./LibrarianLayout.css";

export default function LibrarianLayout() {
  return (
    <div className="admin-container">
      <Sidebar role="Thủ thư" menuItems={librarianMenuItems} />
      <main className="main">
        <Topbar />
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}