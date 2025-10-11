// src/utils/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ allowedRoles, children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Nếu chưa đăng nhập → quay lại /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu roleId của user không nằm trong danh sách cho phép
  if (!allowedRoles.includes(user.roleId)) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có quyền thì render tiếp
  return children || <Outlet />;
}
