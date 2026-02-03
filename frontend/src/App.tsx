

import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/dashboard/Customers";
import Products from "./pages/dashboard/Products";
import Khata from "./pages/dashboard/Khata";
import CustomerDetail from "./pages/dashboard/CustomerDetail";

export const serverUrl = "http://localhost:5000";

import useGetUser from "./hooks/useGetUser";
import { useSelector } from "react-redux";

function App() {
  const { loading } = useGetUser();   // fetch user from backend
  const { user } = useSelector((state) => state.user);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ PUBLIC ROUTES */}
        <Route
          path="/signin"
          element={!user ? <Signin /> : <Navigate to="/dashboard" replace />}
        />

        <Route
          path="/"
          element={!user ? <Signup /> : <Navigate to="/dashboard" replace />}
        />

        {/* ✅ PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/signin" replace />}
        />

        <Route
          path="/dashboard/customers"
          element={user ? <Customers /> : <Navigate to="/signin" replace />}
        />

        <Route
          path="/dashboard/products"
          element={user ? <Products /> : <Navigate to="/signin" replace />}
        />

        <Route
          path="/dashboard/khata"
          element={user ? <Khata /> : <Navigate to="/signin" replace />}
        />

        <Route
          path="/dashboard/customer/:id"
          element={user ? <CustomerDetail /> : <Navigate to="/signin" replace />}
        />

        {/* ✅ CATCH ALL */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/signin"} replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
