import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { adminRoutes } from "./adminRoutes";
import { librarianRoutes } from "./librarianRoutes";

export const router = createBrowserRouter([
  ...authRoutes,
  adminRoutes,
  librarianRoutes,
]);