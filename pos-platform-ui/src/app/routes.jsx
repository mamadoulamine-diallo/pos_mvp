import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProductsPage from "../features/products/pages/ProductsPage";
import CategoriesPage from "../features/categories/pages/CategoriesPage";
import SalesPage from "../features/sales/pages/SalesPage";
import NewSalePage from "../features/sales/pages/NewSalePage";
import UsersPage from "../features/users/pages/UsersPage";
import LoginPage from "../features/auth/pages/LoginPage";

const routes = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "sales",
        element: <SalesPage />,
      },
      {
        path: "sales/new",
        element: <NewSalePage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
    ],
  },
]);

export default routes;
