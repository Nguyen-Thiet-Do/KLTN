import { FaBookReader, FaBook, FaExchangeAlt, FaChartBar } from "react-icons/fa";

export const librarianMenuItems = [
  { path: "/librarian/documents", icon: FaBook, label: "Tài liệu" },
  { path: "/librarian/borrow", icon: FaExchangeAlt, label: "Mượn trả" },
  { path: "/librarian/readers", icon: FaBookReader, label: "Độc giả" },
  { path: "/librarian/statistics", icon: FaChartBar, label: "Thống kê" },
];