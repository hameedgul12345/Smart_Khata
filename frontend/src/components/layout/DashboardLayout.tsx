import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  BookOpen,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import type { RootState } from "../../redux/store";
import { useAppSelector } from "../../redux/hooks";


interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  
  const user = useAppSelector((state: RootState) => state.user.user);
    // console.log("user Profile",user)  
  return (
    <div className="flex min-h-screen  bg-slate-100">

      {/* Sidebar */}
      <aside className="w-64  bg-gradient-to-b from-teal-600 to-cyan-700 text-white hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-white/20">
          💼 Khata System
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>


          <NavLink
            to="/dashboard/items"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <Package size={20} /> Items
          </NavLink>



          <NavLink
            to="/dashboard/customers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <Users size={20} /> Customers
          </NavLink>

          
          <NavLink
            to="/dashboard/suppliers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <BookOpen size={20} /> Suppliers
          </NavLink>




          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            {/* <BookOpen size={20} /> Khata */}
            <Users size={20}/>Profile
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
              <img src={`https://ui-avatars.com/api/?name=${user?.name}`} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
