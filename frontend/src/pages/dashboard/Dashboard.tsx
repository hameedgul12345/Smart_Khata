// import { type FC } from "react";
// import DashboardLayout from "../../components/layout/DashboardLayout";

// /* ================= TYPES ================= */
// interface StatCardProps {
//   title: string;
//   value: string | number;
// }

// /* ================= DASHBOARD PAGE ================= */
// const Dashboard: FC = () => {
//   return (
//     <DashboardLayout>
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard title="Total Customers" value={24} />
//         <StatCard title="Total Products" value={58} />
//         <StatCard title="Total Due" value="Rs 45,000" />
//         <StatCard title="Today Sales" value="Rs 3,200" />
//       </div>

//       {/* Placeholder Sections */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
//         <div className="bg-white rounded-xl shadow p-6 h-64">
//           <h3 className="font-semibold text-gray-700 mb-2">Recent Customers</h3>
//           <p className="text-gray-400">Coming soon...</p>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6 h-64">
//           <h3 className="font-semibold text-gray-700 mb-2">Recent Transactions</h3>
//           <p className="text-gray-400">Coming soon...</p>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// /* ================= STAT CARD COMPONENT ================= */
// const StatCard: FC<StatCardProps> = ({ title, value }) => {
//   return (
//     <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
//       <p className="text-gray-500 text-sm">{title}</p>
//       <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
//     </div>
//   );
// };

// export default Dashboard;

import {type FC, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

/* ================= TYPES ================= */
type Range = "today" | "7days" | "30days";

interface StatCardProps {
  title: string;
  value: string | number;
  color?: "red" | "green" | "blue";
}

/* ================= MOCK DATA (Replace with API later) ================= */
const statsData = {
  today: {
    due: "Rs 45,000",
    sales: "Rs 4,800",
    collection: "Rs 3,200",
    customers: 3,
  },
  "7days": {
    due: "Rs 62,000",
    sales: "Rs 28,500",
    collection: "Rs 21,400",
    customers: 12,
  },
  "30days": {
    due: "Rs 95,000",
    sales: "Rs 112,000",
    collection: "Rs 86,300",
    customers: 38,
  },
};

/* ================= DASHBOARD ================= */
const Dashboard: FC = () => {
  const [range, setRange] = useState<Range>("today");
  const data = statsData[range];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-700">
          Business Overview
        </h2>
        <p className="text-sm text-gray-400">
          Track your khata easily
        </p>
      </div>

      {/* Time Filter */}
      <TimeFilter active={range} onChange={setRange} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <StatCard title="Total Due" value={data.due} color="red" />
        <StatCard title="Collection" value={data.collection} color="green" />
        <StatCard title="Sales" value={data.sales} />
        <StatCard title="Customers" value={data.customers} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <QuickAction label="Add Sale" color="bg-blue-600" />
        <QuickAction label="Receive" color="bg-green-600" />
        <QuickAction label="Customer" color="bg-gray-800" />
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        <TransactionItem
          name="Ali Khan"
          type="Sale"
          amount="+ Rs 1,200"
          color="text-red-600"
        />
        <TransactionItem
          name="Ahmed Raza"
          type="Payment"
          amount="- Rs 500"
          color="text-green-600"
        />
      </Card>

      {/* High Due Customers */}
      <Card title="High Due Customers">
        <DueItem name="Bilal Store" amount="Rs 18,500" />
        <DueItem name="Usman Khan" amount="Rs 12,000" />
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;

/* ================= TIME FILTER ================= */
const TimeFilter = ({
  active,
  onChange,
}: {
  active: Range;
  onChange: (value: Range) => void;
}) => (
  <div className="flex bg-gray-200 rounded-xl p-1 mt-3">
    {[
      { key: "today", label: "Today" },
      { key: "7days", label: "7 Days" },
      { key: "30days", label: "30 Days" },
    ].map((item) => (
      <button
        key={item.key}
        onClick={() => onChange(item.key as Range)}
        className={`flex-1 py-2 rounded-lg text-sm font-medium transition
          ${
            active === item.key
              ? "bg-white shadow text-blue-600"
              : "text-gray-500"
          }`}
      >
        {item.label}
      </button>
    ))}
  </div>
);

/* ================= STAT CARD ================= */
const StatCard: FC<StatCardProps> = ({ title, value, color = "blue" }) => {
  const colors = {
    red: "text-red-600",
    green: "text-green-600",
    blue: "text-blue-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <h3 className={`text-2xl font-bold mt-1 ${colors[color]}`}>
        {value}
      </h3>
    </div>
  );
};

/* ================= QUICK ACTION ================= */
const QuickAction = ({
  label,
  color,
}: {
  label: string;
  color: string;
}) => (
  <button
    className={`${color} text-white py-3 rounded-xl font-semibold shadow-sm`}
  >
    {label}
  </button>
);

/* ================= CARD ================= */
const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-sm p-4 mt-6">
    <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

/* ================= TRANSACTION ITEM ================= */
const TransactionItem = ({
  name,
  type,
  amount,
  color,
}: {
  name: string;
  type: string;
  amount: string;
  color: string;
}) => (
  <div className="flex justify-between items-center">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-xs text-gray-400">{type}</p>
    </div>
    <p className={`font-semibold ${color}`}>{amount}</p>
  </div>
);

/* ================= DUE ITEM ================= */
const DueItem = ({
  name,
  amount,
}: {
  name: string;
  amount: string;
}) => (
  <div className="flex justify-between">
    <p>{name}</p>
    <p className="text-red-600 font-semibold">{amount}</p>
  </div>
);
