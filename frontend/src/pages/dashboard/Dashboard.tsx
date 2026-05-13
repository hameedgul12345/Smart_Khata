

// import DashboardLayout from "../../components/layout/DashboardLayout";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// import { useAppSelector } from "../../redux/hooks";
// import type { RootState } from "../../redux/store";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { serverUrl } from "../../App";

// /* ================= TYPES ================= */

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   color: string;
// }

// interface IChartData {
//   date: string;
//   sale: number;
// }

// interface ISaleData {
//   todaySale: number;
//   last7DaysSale: number;
//   last30DaysSale: number;
//   daily7Days: { date?: string; total: number }[];
//   daily30Days: { date?: string; total: number }[];
// }

// /* ================= COMPONENT ================= */

// const Dashboard: React.FC = () => {
//   const items = useAppSelector((state: RootState) => state.items.items);
//   const customers = useAppSelector(
//     (state: RootState) => state.customers.customers
//   );

//   const [sales, setSales] = useState<ISaleData | null>(null);
//   const [range, setRange] = useState<"7" | "30">("7");
//   const [chartData, setChartData] = useState<IChartData[]>([]);

//   /* ================= CALCULATIONS ================= */

//   let totalStockValue = 0;
//   let totalDue = 0;
//   let inStock = 0;
//   let outOfStock = 0;

//   customers.forEach((c) => {
//     totalDue += c.totalAmount || 0;
//   });

//   items.forEach((item) => {
//     totalStockValue += item.price * item.quantity;

//     if (item.stockStatus === "IN_STOCK") inStock++;
//     else outOfStock++;
//   });

//   /* ================= FETCH STATS ================= */

//   useEffect(() => {
//     const getStats = async () => {
//       try {
//         const res = await axios.get<ISaleData>(
//           `${serverUrl}/api/user/getStates`,
//           { withCredentials: true }
//         );

//         const data = res.data;
//         setSales(data);

//         const raw = range === "7" ? data.daily7Days : data.daily30Days;

//         setChartData(
//           raw.map((d) => ({
//             date: d.date ?? "",
//             sale: d.total,
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching stats:", error);
//       }
//     };

//     getStats();
//   }, [range]);

//   /* ================= UI ================= */

//   return (
//     <DashboardLayout>
//       <div className="p-6 space-y-8 bg-slate-50 min-h-screen">

//         {/* HEADER */}
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             Business Overview
//           </h1>
//           <p className="text-sm text-gray-500">
//             Real-time analytics of your SaaS system
//           </p>
//         </div>

//         {/* TOP STATS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//           <StatCard
//             title="Stock Value"
//             value={`Rs ${totalStockValue}`}
//             color="blue"
//           />
//           <StatCard
//             title="Total Due"
//             value={`Rs ${totalDue}`}
//             color="red"
//           />
//           <StatCard
//             title="Customers"
//             value={customers.length}
//             color="purple"
//           />
//           <StatCard
//             title="Items"
//             value={items.length}
//             color="indigo"
//           />
//         </div>

//         {/* SALES SUMMARY */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <StatCard
//             title="Today Sales"
//             value={`Rs ${sales?.todaySale ?? 0}`}
//             color="green"
//           />
//           <StatCard
//             title="7 Days Sales"
//             value={`Rs ${sales?.last7DaysSale ?? 0}`}
//             color="teal"
//           />
//           <StatCard
//             title="30 Days Sales"
//             value={`Rs ${sales?.last30DaysSale ?? 0}`}
//             color="orange"
//           />
//         </div>

//         {/* CHART */}
//         <div className="bg-white rounded-2xl shadow-sm border p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="font-semibold text-gray-700">
//               Sales Analytics
//             </h2>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => setRange("7")}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                   range === "7"
//                     ? "bg-black text-white"
//                     : "bg-gray-100 text-gray-600"
//                 }`}
//               >
//                 7 Days
//               </button>

//               <button
//                 onClick={() => setRange("30")}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                   range === "30"
//                     ? "bg-black text-white"
//                     : "bg-gray-100 text-gray-600"
//                 }`}
//               >
//                 30 Days
//               </button>
//             </div>
//           </div>

//           <ResponsiveContainer width="100%" height={320}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />

//               <XAxis
//                 dataKey="date"
//                 tickFormatter={(value: string) => value.slice(5)}
//               />

//               <YAxis />

//               <Tooltip formatter={(value) => `Rs ${value}`} />

//               <Line
//                 type="monotone"
//                 dataKey="sale"
//                 stroke="#0f766e"
//                 strokeWidth={3}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* INVENTORY STATUS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <StatCard
//             title="In Stock Items"
//             value={inStock}
//             color="emerald"
//           />
//           <StatCard
//             title="Out of Stock"
//             value={outOfStock}
//             color="rose"
//           />
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// /* ================= STAT CARD ================= */

// const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
//   const colorMap: Record<string, string> = {
//     blue: "border-blue-500",
//     red: "border-red-500",
//     purple: "border-purple-500",
//     indigo: "border-indigo-500",
//     green: "border-green-500",
//     teal: "border-teal-500",
//     orange: "border-orange-500",
//     emerald: "border-emerald-500",
//     rose: "border-rose-500",
//   };

//   return (
//     <div
//       className={`bg-white rounded-2xl shadow-sm border-l-4 ${
//         colorMap[color]
//       } p-6 hover:shadow-md transition`}
//     >
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
//     </div>
//   );
// };

// export default Dashboard;

"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";

/* ================= TYPES ================= */

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
}

interface IChartData {
  date: string;
  sale: number;
}

interface ISaleData {
  todaySale: number;
  last7DaysSale: number;
  last30DaysSale: number;
  daily7Days: { date?: string; total: number }[];
  daily30Days: { date?: string; total: number }[];
}

/* ================= COMPONENT ================= */

const Dashboard: React.FC = () => {
  const items = useAppSelector(
    (state: RootState) => state.items.items
  );

  const customers = useAppSelector(
    (state: RootState) => state.customers.customers
  );

  const [sales, setSales] = useState<ISaleData | null>(null);

  const [range, setRange] = useState<"7" | "30">("7");

  const [chartData, setChartData] = useState<IChartData[]>(
    []
  );

  /* ================= CALCULATIONS ================= */

  let totalStockValue = 0;
  let totalDue = 0;
  let inStock = 0;
  let outOfStock = 0;

  customers.forEach((c) => {
    totalDue += c.totalAmount || 0;
  });

  items.forEach((item) => {
    totalStockValue += item.price * item.quantity;

    if (item.stockStatus === "IN_STOCK") {
      inStock++;
    } else {
      outOfStock++;
    }
  });

  /* ================= FETCH STATS ================= */

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get<ISaleData>(
          `${serverUrl}/api/user/getStates`,
          { withCredentials: true }
        );

        const data = res.data;

        setSales(data);

        const raw =
          range === "7"
            ? data.daily7Days
            : data.daily30Days;

        setChartData(
          raw.map((d) => ({
            date: d.date ?? "",
            sale: d.total,
          }))
        );
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    getStats();
  }, [range]);

  /* ================= UI ================= */

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0f172a] p-6 space-y-8 text-white">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Business Overview
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Real-time analytics of your SaaS system
          </p>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Stock Value"
            value={`Rs ${totalStockValue}`}
            color="blue"
          />

          <StatCard
            title="Total Due"
            value={`Rs ${totalDue}`}
            color="red"
          />

          <StatCard
            title="Customers"
            value={customers.length}
            color="purple"
          />

          <StatCard
            title="Items"
            value={items.length}
            color="indigo"
          />
        </div>

        {/* SALES SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Today Sales"
            value={`Rs ${sales?.todaySale ?? 0}`}
            color="green"
          />

          <StatCard
            title="7 Days Sales"
            value={`Rs ${sales?.last7DaysSale ?? 0}`}
            color="teal"
          />

          <StatCard
            title="30 Days Sales"
            value={`Rs ${sales?.last30DaysSale ?? 0}`}
            color="orange"
          />
        </div>

        {/* CHART */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-white text-lg">
              Sales Analytics
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setRange("7")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  range === "7"
                    ? "bg-white text-black"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                7 Days
              </button>

              <button
                onClick={() => setRange("30")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  range === "30"
                    ? "bg-white text-black"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
              />

              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                tickFormatter={(value: string) =>
                  value.slice(5)
                }
              />

              <YAxis stroke="#94a3b8" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                formatter={(value) => `Rs ${value}`}
              />

              <Line
                type="monotone"
                dataKey="sale"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#22c55e",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* INVENTORY STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="In Stock Items"
            value={inStock}
            color="emerald"
          />

          <StatCard
            title="Out of Stock"
            value={outOfStock}
            color="rose"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

/* ================= STAT CARD ================= */

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
}) => {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500",
    red: "from-red-500/20 to-red-500/5 border-red-500",
    purple:
      "from-purple-500/20 to-purple-500/5 border-purple-500",
    indigo:
      "from-indigo-500/20 to-indigo-500/5 border-indigo-500",
    green:
      "from-green-500/20 to-green-500/5 border-green-500",
    teal: "from-teal-500/20 to-teal-500/5 border-teal-500",
    orange:
      "from-orange-500/20 to-orange-500/5 border-orange-500",
    emerald:
      "from-emerald-500/20 to-emerald-500/5 border-emerald-500",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition-all duration-300`}
    >
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h3 className="text-3xl font-bold text-white mt-3">
        {value}
      </h3>
    </div>
  );
};

export default Dashboard;