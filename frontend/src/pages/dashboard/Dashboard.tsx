import { type FC } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

/* ================= TYPES ================= */
interface StatCardProps {
  title: string;
  value: string | number;
}

/* ================= DASHBOARD PAGE ================= */
const Dashboard: FC = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Customers" value={24} />
        <StatCard title="Total Products" value={58} />
        <StatCard title="Total Due" value="Rs 45,000" />
        <StatCard title="Today Sales" value="Rs 3,200" />
      </div>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow p-6 h-64">
          <h3 className="font-semibold text-gray-700 mb-2">Recent Customers</h3>
          <p className="text-gray-400">Coming soon...</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 h-64">
          <h3 className="font-semibold text-gray-700 mb-2">Recent Transactions</h3>
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

/* ================= STAT CARD COMPONENT ================= */
const StatCard: FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
    </div>
  );
};

export default Dashboard;
