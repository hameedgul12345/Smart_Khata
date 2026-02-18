import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  BookOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { RootState } from "../../redux/store";
import { useAppSelector } from "../../redux/hooks";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const user = useAppSelector((state: RootState) => state.user.user);
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 text-2xl font-bold border-b border-white/20">
        💼 Khata System
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {[
          { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
          { to: "/dashboard/items", icon: <Package size={20} />, label: "Items" },
          { to: "/dashboard/customers", icon: <Users size={20} />, label: "Customers" },
          { to: "/dashboard/suppliers", icon: <BookOpen size={20} />, label: "Suppliers" },
          { to: "/dashboard/profile", icon: <Users size={20} />, label: "Profile" },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/20">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-white/10 transition">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-teal-600 to-cyan-700 text-white hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-teal-600 to-cyan-700 text-white z-50 transform transition-transform md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <span className="text-xl font-bold">💼 Khata</span>
          <X className="cursor-pointer" onClick={() => setOpen(false)} />
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Menu
              className="md:hidden cursor-pointer"
              onClick={() => setOpen(true)}
            />
            <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>
          </div>

          <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
