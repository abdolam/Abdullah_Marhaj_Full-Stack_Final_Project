import { Navigate, Route, Routes } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import AboutPage from "../pages/AboutPage";
import AccountPage from "../pages/AccountPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminUserDetailsPage from "../pages/admin/AdminUserDetailsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import CartPage from "../pages/CartPage";
import ContactPage from "../pages/ContactPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import OrdersPage from "../pages/OrdersPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import ProductsPage from "../pages/ProductsPage";
import ProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

import Layout from "./Layout";

function AdminGate({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          אין הרשאה
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          כדי לצפות בעמוד ניהול צריך להתחבר עם משתמש Admin.
        </p>
        <a
          href="/login"
          className="inline-flex rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-gold hover:text-brand-navy"
        >
          התחברות
        </a>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          אין הרשאה
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          אין לך הרשאות Admin.
        </p>
        <a
          href="/"
          className="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
        >
          חזרה לעמוד הבית
        </a>
      </div>
    );
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/account" element={<AccountPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />

        <Route
          path="/admin"
          element={
            <AdminGate>
              <AdminDashboardPage />
            </AdminGate>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminGate>
              <AdminProductsPage />
            </AdminGate>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminGate>
              <AdminCategoriesPage />
            </AdminGate>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminGate>
              <AdminOrdersPage />
            </AdminGate>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminGate>
              <AdminUsersPage />
            </AdminGate>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <AdminGate>
              <AdminUserDetailsPage />
            </AdminGate>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
