

import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

// ================= PAGES =================
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";

import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/dashboard/Customers";
import CustomerDetail from "./pages/dashboard/CustomerDetail";
import Profile from "./pages/dashboard/Profile";
import Items from "./pages/dashboard/Items";
import ViewBill from "./pages/dashboard/ViewBill";

import Login from "./pages/admin/login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLayout from "./pages/admin/AdminLayout";

// ================= REDUX / HOOKS =================
import { useAppSelector } from "./redux/hooks";
import type { RootState } from "./redux/store";
import useGetUser from "./hooks/useGetUser";
import useGetItems from "./hooks/useGetItems";
import useGetCustomers from "./hooks/useGetCustomers";

// ================= SERVER =================
export const serverUrl = "http://localhost:5000";

function App() {
  const { loading } = useGetUser();
  useGetItems();
  useGetCustomers();

  const user = useAppSelector((state: RootState) => state.user.user);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route
          path="/"
          element={!user ? <Signup /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/signin"
          element={!user ? <Signin /> : <Navigate to="/dashboard" replace />}
        />

        {/* ========== ADMIN ROUTES ========== */}
        <Route
          path="/admin/login"
          element={!user ? <Login /> : <Navigate to="/admin" replace />}
        />

        <Route path="/admin">
          <Route
            index
            element={
              user?.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="users"
            element={
              user?.role === "admin" ? (
                <AdminUsers />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="stores"
            element={
              user?.role === "admin" ? (
                <AdminStores />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="subscription"
            element={
              user?.role === "admin" ? (
                <AdminSubscriptions />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="settings"
            element={
              user?.role === "admin" ? (
                <AdminSettings />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
        </Route>

        {/* ========== USER DASHBOARD ROUTES ========== */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/dashboard/customers"
          element={user ? <Customers /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/dashboard/items"
          element={user ? <Items /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/dashboard/view-bill/:id"
          element={user ? <ViewBill /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/dashboard/profile"
          element={user ? <Profile /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/dashboard/customer/:id"
          element={
            user ? <CustomerDetail /> : <Navigate to="/signin" replace />
          }
        />

        {/* ========== FALLBACK ROUTE ========== */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/signin"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
