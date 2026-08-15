import {
  Navigate,
  createBrowserRouter,
} from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

import CategoriesPage from "../features/categories/pages/CategoriesPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProductsPage from "../features/products/pages/ProductsPage";
import NewSalePage from "../features/sales/pages/NewSalePage";
import SalesHistoryPage from "../features/sales/pages/SalesHistoryPage";
import UsersPage from "../features/users/pages/UsersPage";

import MainLayout from "../layouts/MainLayout";

const routes = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),

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
        element: (
          <Navigate
            to="/sales/new"
            replace
          />
        ),
      },

      {
        path: "sales/new",
        element: <NewSalePage />,
      },

      {
        path: "sales/history",
        element: <SalesHistoryPage />,
      },

      {
        path: "users",
        element: <UsersPage />,
      },
    ],
  },
]);

export default routes;