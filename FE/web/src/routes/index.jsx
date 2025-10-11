// import { createBrowserRouter } from "react-router-dom";
// import Login from "../pages/Auth/Login/Login";
// import SignUp from "../pages/Auth/SignUp/SignUp";
// import Dashboard from "../pages/Dashboard/Dashboard";
// import Readers from "../pages/Readers/Readers";
// import Librarians from "../pages/Librarians/Librarians";
// import Documents from "../pages/Documents/Documents";
// import Borrow from "../pages/Borrow/Borrow";



// import LibrarianDashboard from "../pages/Dashboard/LibrarianDashboard";



// export const router = createBrowserRouter([
//   { path: "/login", element: <Login /> },
//   { path: "/", element: <Login /> },
//   { path: "/signup", element: <SignUp /> },
//   { path: "/admin", element: <Dashboard /> },
//   { path: "/readers", element: <Readers /> },
//   { path: "/librarians", element: <Librarians /> },
//   { path: "/documents", element: <Documents /> },
//   { path: "/borrow", element: <Borrow /> },

//   { path: "/librarian", element: <LibrarianDashboard /> },
// ]);

// src/routes/index.jsx
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../utils/PrivateRoute";

// Auth
import Login from "../pages/Auth/Login/Login";
import SignUp from "../pages/Auth/SignUp/SignUp";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import LibrarianLayout from "../layouts/LibrarianLayout";

// Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Readers from "../pages/Readers/Readers";
import Librarians from "../pages/Librarians/Librarians";
import Documents from "../pages/Documents/Documents";
import Borrow from "../pages/Borrow/Borrow";
import LibrarianDashboard from "../pages/Dashboard/LibrarianDashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },

  // === ADMIN ===
  {
    path: "/admin",
    element: (
      <PrivateRoute allowedRoles={[1]}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "readers", element: <Readers /> },
      { path: "librarians", element: <Librarians /> },
      { path: "documents", element: <Documents role="admin" /> },
      { path: "borrow", element: <Borrow /> },
    ],
  },

  // === LIBRARIAN ===
  {
    path: "/librarian",
    element: (
      <PrivateRoute allowedRoles={[2]}>
        <LibrarianLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <LibrarianDashboard /> },
      { path: "documents", element: <Documents role="librarian" /> },
      { path: "borrow", element: <Borrow /> },
      { path: "readers", element: <Readers /> },
    ],
  },
]);
