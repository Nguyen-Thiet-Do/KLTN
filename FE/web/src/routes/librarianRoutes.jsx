// src/routes/librarianRoutes.jsx
import LibrarianLayout from "../components/page-layouts/LibrarianLayout";
import LibrarianDashboard from "../pages/Dashboard/LibrarianDashboard";
import Documents from "../pages/Documents/Documents";
import Borrow from "../pages/Borrow/Borrow";
import Readers from "../pages/Readers/Readers";

export const librarianRoutes = {
  path: "/librarian",
  element: <LibrarianLayout />,
  children: [
    { index: true, element: <LibrarianDashboard /> },
    { path: "documents", element: <Documents role="librarian" /> },
    { path: "borrow", element: <Borrow /> },
    { path: "readers", element: <Readers /> },
  ],
};