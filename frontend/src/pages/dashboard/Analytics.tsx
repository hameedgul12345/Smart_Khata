import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";

/* ================= TYPES ================= */

interface IData {
  date: string;
  sale: number;
}

interface ISaleData {
  daily7Days: { date?: string; total: number }[];
  daily30Days: { date?: string; total: number }[];
}

/* ================= COMPONENT ================= */

const Analytics: React.FC = () => {
  const [range, setRange] = useState<"7" | "30">("7");
  const [data, setData] = useState<IData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<ISaleData>(
          `${serverUrl}/api/user/getStates`,
          { withCredentials: true }
        );

        const raw =
          range === "7" ? res.data.daily7Days : res.data.daily30Days;

        setData(
          raw.map((d) => ({
            date: d.date ?? "",
            sale: d.total,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [range]);

  /* ================= CALCULATIONS ================= */

  const total = data.reduce((acc, cur) => acc + cur.sale, 0);
  const avg = data.length ? Math.round(total / data.length) : 0;

  const pieData = [
    { name: "Total Sales", value: total },
    { name: "Average Sales", value: avg },
  ];

  const COLORS = ["#1A9899", "#6366F1"];

  /* ================= UI ================= */

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 bg-slate-50 min-h-screen">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Deep insights into your business performance
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-2">
          <button
            onClick={() => setRange("7")}
            className={`px-4 py-2 rounded-lg ${
              range === "7" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            7 Days
          </button>

          <button
            onClick={() => setRange("30")}
            className={`px-4 py-2 rounded-lg ${
              range === "30" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            30 Days
          </button>
        </div>

        {/* LINE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="mb-4 font-semibold">Sales Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sale"
                stroke="#1A9899"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="mb-4 font-semibold">Daily Comparison</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sale" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="mb-4 font-semibold">Sales Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analytics;