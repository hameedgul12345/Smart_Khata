
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
  daily7Days: { _id: string; total: number }[];
  daily30Days: { _id: string; total: number }[];
}

/* ================= COMPONENT ================= */

const Dashboard: React.FC = () => {
  const items = useAppSelector((state: RootState) => state.items.items);
  const customers = useAppSelector(
    (state: RootState) => state.customers.customers,
  );

  const [sales, setSales] = useState<ISaleData | null>(null);
  const [range, setRange] = useState<"7" | "30">("7");
  const [chartData, setChartData] = useState<IChartData[]>([]);

  let totalStockValue = 0;
  let totalDue = 0;
  let totalCustomers = 0;
  let totalItems = 0;
  let inStock = 0;
  let outOfStock = 0;

  customers.forEach((c) => {
    totalDue += c.totalDue;
    totalCustomers++;
  });

  items.forEach((item) => {
    totalStockValue += item.price * item.quantity;
    totalItems++;

    if (item.stockStatus === "IN_STOCK") inStock++;
    else outOfStock++;
  });

  useEffect(() => {
    const getStates = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/getStates`, {
          withCredentials: true,
        });

        setSales(res.data);
        console.log(res.data)

        const raw =
          range === "7"
            ? res.data.daily7Days
            : res.data.daily30Days;

        const formatted = raw.map((d: any) => ({
          date: d._id,
          sale: d.total,
        }));

        setChartData(formatted);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    getStates();
  }, [range]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Stock Value"
            value={`Rs ${totalStockValue}`}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Due"
            value={`Rs ${totalDue}`}
            color="bg-red-500"
          />
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Items"
            value={totalItems}
            color="bg-indigo-500"
          />
        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Today Sale"
            value={`Rs ${sales?.daily7Days[0]?.total ?? 0}`}
            color="bg-green-500"
          />
          <StatCard
            title="Last 7 Days Sale"
            value={`Rs ${sales?.last7DaysSale ?? 0}`}
            color="bg-teal-500"
          />
          <StatCard
            title="Last 30 Days Sale"
            value={`Rs ${sales?.last30DaysSale ?? 0}`}
            color="bg-orange-500"
          />
        </div>

        {/* SALES CHART */}
        <div className="bg-white shadow rounded-xl p-6 border">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setRange("7")}
              className={`px-4 py-2 rounded ${
                range === "7"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Last 7 Days
            </button>

            <button
              onClick={() => setRange("30")}
              className={`px-4 py-2 rounded ${
                range === "30"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Last 30 Days
            </button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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

        {/* ROW 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="In Stock"
            value={inStock}
            color="bg-emerald-500"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStock}
            color="bg-rose-500"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

/* ================= STAT CARD ================= */

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  return (
    <div className={`${color} text-white rounded-xl shadow p-6`}>
      <h3 className="text-sm opacity-90">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default Dashboard;
