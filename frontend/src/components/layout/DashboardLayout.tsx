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
} from "lucide-react";

import { useState, type ReactNode } from "react";
import type { RootState } from "../../redux/store";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { clearUser } from "../../redux/slices/userSlice";
import axios from "axios";
import { serverUrl } from "../../App";

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
    } finally {
      dispatch(clearUser());
      navigate("/signin");
      setLoading(false);
    }
  };

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Overview" },
    { to: "/dashboard/analytics", icon: <TrendingUp size={18} />, label: "Analytics" },
    { to: "/dashboard/items", icon: <Package size={18} />, label: "Inventory" },
    { to: "/dashboard/customers", icon: <Users size={18} />, label: "Customers" },
    { to: "/dashboard/settings", icon: <Settings size={18} />, label: "Settings" },
    { to: "/dashboard/profile", icon: <User size={18} />, label: "Profile" },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col md:flex w-72">

      {/* LOGO */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          SaleTrack
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Smart Business Dashboard
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-3 space-y-1  bg-[#0b1220]/80 backdrop-blur-xl border-r border-white/10">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-white shadow-lg shadow-cyan-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="group-hover:scale-110 transition-transform text-cyan-300">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* USER CARD */}
      <div className="p-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={signout}
            disabled={loading}
            className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium
            bg-red-500/10 hover:bg-red-500/20 border border-red-500/20
            text-red-400 transition disabled:opacity-50"
          >
            <LogOut size={16} className="inline mr-2" />
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-72 bg-[#0b1220]/80 backdrop-blur-xl border-r border-white/10">
        <SidebarContent />
      </aside>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-[#0b1220] border-r border-white/10 z-50 transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h1 className="font-bold text-cyan-400">SaleTrack</h1>
          <X onClick={() => setOpen(false)} className="cursor-pointer" />
        </div>
        <SidebarContent />
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="sticky top-0 z-30 bg-[#050816]/70 backdrop-blur-xl border-b border-white/10 px-4 md:px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-slate-300"
            >
              <Menu />
            </button>

            <div>
              <h2 className="text-lg font-semibold text-cyan-300">
                Dashboard
              </h2>
              <p className="text-xs text-slate-400">
                Welcome back 👋
              </p>
            </div>
          </div>

          {/* USER */}
          <div className="flex items-center gap-3">

            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 bg-[#050816]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;