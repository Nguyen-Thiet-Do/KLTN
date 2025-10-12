import AdminLayout from "../components/page-layouts/AdminLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Readers from "../pages/Readers/Readers";
import Librarians from "../pages/Librarians/Librarians";
import Documents from "../pages/Documents/Documents";
import Borrow from "../pages/Borrow/Borrow";
import ProtectedRoute from "./ProtectedRoute";

export const adminRoutes = {
  path: "/admin",
  element: <ProtectedRoute allowedRoles={[1]} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "readers", element: <Readers /> },
        { path: "librarians", element: <Librarians /> },
        { path: "documents", element: <Documents role="admin" /> },
        { path: "borrow", element: <Borrow /> },
      ],
    },
  ],
};