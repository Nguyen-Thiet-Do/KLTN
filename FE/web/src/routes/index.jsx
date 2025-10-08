import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login/Login";
import SignUp from "../pages/Auth/SignUp/SignUp";
import Dashboard from "../pages/Dashboard/Dashboard";
import Readers from "../pages/Readers/Readers";
import Librarians from "../pages/Librarians/Librarians";
import Documents from "../pages/Documents/Documents";
import Borrow from "../pages/Borrow/Borrow";
export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/admin", element: <Dashboard /> },
  { path: "/readers", element: <Readers /> },
  { path: "/librarians", element: <Librarians /> },
  { path: "/documents", element: <Documents /> },
  { path: "/borrow", element: <Borrow /> },
]);

