"use client";

import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  TrendingUp,
  CreditCard,
  FileText,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { RootState } from "../../redux/store";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { clearUser } from "../../redux/slices/userSlice";
import { serverUrl } from "../../App";
import axios from "axios";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const user = useAppSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const signout = async () => {
    try {
      setLoading(true);

      await axios.post(
        `${serverUrl}/api/user/signout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      dispatch(clearUser());
      navigate("/signin");
      setLoading(false);
    }
  };

//   const navItems = [
//   {
//     to: "/dashboard",
//     icon: <LayoutDashboard size={18} />,
//     label: "Overview",
//   },

//   /* ================= CORE BUSINESS ================= */
//   {
//     to: "/dashboard/analytics",
//     icon: <TrendingUp size={18} />,
//     label: "Analytics",
//   },
//   {
//     to: "/dashboard/inventory",
//     icon: <Package size={18} />,
//     label: "Inventory",
//   },
//   {
//     to: "/dashboard/customers",
//     icon: <Users size={18} />,
//     label: "Customers",
//   },

//   /* ================= FINANCE ================= */
//   {
//     to: "/dashboard/payments",
//     icon: <CreditCard size={18} />,
//     label: "Payments",
//   },
//   {
//     to: "/dashboard/invoices",
//     icon: <FileText size={18} />,
//     label: "Invoices",
//   },

//   /* ================= BUSINESS CONTROL ================= */
//   {
//     to: "/dashboard/reports",
//     icon: <BarChart3 size={18} />,
//     label: "Reports",
//   },
//   {
//     to: "/dashboard/ledger",
//     icon: <BookOpen size={18} />,
//     label: "Ledger",
//   },

//   /* ================= SYSTEM ================= */
//   {
//     to: "/dashboard/settings",
//     icon: <Settings size={18} />,
//     label: "Settings",
//   },
//   {
//     to: "/dashboard/profile",
//     icon: <User size={18} />,
//     label: "Profile",
//   },
// ];



const navItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      to: "/dashboard/items",
      icon: <Package size={18} />,
      label: "Items",
    },
    {
      to: "/dashboard/customers",
      icon: <Users size={18} />,
      label: "Customers",
    },
    {
      to: "/dashboard/profile",
      icon: <User size={18} />,
      label: "Profile",
    },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col">

      {/* BRAND */}
      <div className="p-6 text-xl font-bold border-b border-white/10 tracking-wide">
      SaleTrack
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={signout}
          disabled={loading}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition disabled:opacity-50 text-sm"
        >
          <LogOut size={18} />
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-50 transform transition-transform md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <span className="font-bold">SaleTrack</span>
          <X className="cursor-pointer" onClick={() => setOpen(false)} />
        </div>
        <SidebarContent />
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <Menu
              className="md:hidden cursor-pointer text-gray-700"
              onClick={() => setOpen(true)}
            />
            <h1 className="text-lg font-semibold text-gray-800">
              Dashboard
            </h1>
          </div>

          {/* USER AVATAR */}
          <div className="w-10 h-10 rounded-full ring-2 ring-gray-200 overflow-hidden bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;