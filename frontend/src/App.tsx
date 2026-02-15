

import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/dashboard/Customers";
import { useAppSelector } from "./redux/hooks";
import type { RootState } from "./redux/store";
import CustomerDetail from "./pages/dashboard/CustomerDetail";
import Profile from "./pages/dashboard/Profile";
// export const serverUrl = "http://localhost:5000";

// export const serverUrl = "https://smart-khata-omega.vercel.app" ;
export const serverUrl = "https://smart-khata-iq7r2bra0-hameedguls-projects.vercel.app" ;

import useGetUser from "./hooks/useGetUser"; 
import Items from "./pages/dashboard/Items";
import ViewBill from "./pages/dashboard/ViewBill";
import useGetItems from "./hooks/useGetItmes";
import useGetCustomers from "./hooks/useGetCustomers";


function App() {
  const { loading } = useGetUser();   // fetch user from backend
 useGetItems(); // fetch items from backend and store in redux
  useGetCustomers(); // fetch customers from backend and store in redux
const user = useAppSelector((state: RootState) => state.user.user);


  if (loading) return <div className="mx-auto">Loading...</div>;

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
          path="/dashboard/view-bill/:id"
          element={user ? <ViewBill /> : <Navigate to="/signin" replace />}
        />
           <Route
          path="/dashboard/items"
          element={user ? <Items /> : <Navigate to="/signin" replace />}
        />


         <Route
          path="/dashboard/customers"
          element={user ? <Customers /> : <Navigate to="/signin" replace />}
        />

         <Route
          path="/dashboard/profile"
          element={user ? <Profile /> : <Navigate to="/signin" replace />}
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
