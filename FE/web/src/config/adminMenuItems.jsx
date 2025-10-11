import { FaBookReader, FaUserTie, FaBook, FaExchangeAlt, FaChartBar } from "react-icons/fa";

export const adminMenuItems = [
  { path: "/admin/readers", icon: FaBookReader, label: "Độc giả" },
  { path: "/admin/librarians", icon: FaUserTie, label: "Thủ thư" },
  { path: "/admin/documents", icon: FaBook, label: "Tài liệu" },
  { path: "/admin/borrow", icon: FaExchangeAlt, label: "Mượn trả" },
  { path: "/admin/statistics", icon: FaChartBar, label: "Thống kê" },
];
