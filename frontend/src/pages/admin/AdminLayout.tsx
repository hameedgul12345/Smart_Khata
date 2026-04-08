import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition ${
      isActive
        ? "bg-white text-slate-900"
        : "text-gray-300 hover:bg-slate-700"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white p-5 flex flex-col justify-between">
        
        <div>
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

          <nav className="space-y-2">
            <NavLink to="/admin" className={linkClass}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink to="/admin/users" className={linkClass}>
              <Users size={18} />
              Users
            </NavLink>

            <NavLink to="/admin/stores" className={linkClass}>
              <Store size={18} />
              Stores
            </NavLink>

            <NavLink to="/admin/subscription" className={linkClass}>
              <CreditCard size={18} />
              Subscription
            </NavLink>

            <NavLink to="/admin/settings" className={linkClass}>
              <Settings size={18} />
              Settings
            </NavLink>
          </nav>
        </div>

        {/* Logout */}
        <button className="flex items-center gap-2 text-red-400 hover:text-red-300">
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Right Section */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Navbar */}
        <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Dashboard</h1>

          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;