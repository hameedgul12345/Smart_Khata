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

import { useEffect, useMemo, useState } from "react";
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

/* ================= SMALL ANIMATION HOOK ================= */

const useCountUp = (value: number, duration = 600) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / (duration / 16));

    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        start = value;
        clearInterval(interval);
      }
      setDisplay(start);
    }, 16);

    return () => clearInterval(interval);
  }, [value]);

  return display;
};

/* ================= COMPONENT ================= */

const Analytics: React.FC = () => {
  const [range, setRange] = useState<"7" | "30">("7");
  const [data, setData] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  /* ================= CALCULATIONS ================= */

  const total = useMemo(
    () => data.reduce((a, c) => a + c.sale, 0),
    [data]
  );

  const avg = data.length ? Math.round(total / data.length) : 0;

  const totalAnim = useCountUp(total);
  const avgAnim = useCountUp(avg);

  const pieData = [
    { name: "Total", value: total },
    { name: "Average", value: avg },
  ];

  const COLORS = ["#22d3ee", "#6366f1"];

  /* ================= LOADING UI ================= */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6 bg-[#050816] min-h-screen text-white">

          <div className="h-6 w-48 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-72 bg-white/10 rounded animate-pulse" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[1,2,3,4].map((i) => (
              <div
                key={i}
                className="h-24 bg-white/5 border border-white/10 rounded-xl animate-pulse"
              />
            ))}
          </div>

          <div className="h-64 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
          <div className="h-64 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  /* ================= UI ================= */

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 bg-[#050816] min-h-screen text-white">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-slate-400 text-sm">
            Real-time business intelligence overview
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <KPI title="Total Sales" value={totalAnim} />
          <KPI title="Average Sales" value={avgAnim} />
          <KPI title="Active Days" value={data.length} />

        </div>

        {/* FILTER */}
        <div className="flex gap-3">
          {["7", "30"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as "7" | "30")}
              className={`px-4 py-2 rounded-xl text-sm border transition ${
                range === r
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {r} Days
            </button>
          ))}
        </div>

        {/* INSIGHT BOX */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
          <p className="text-sm text-slate-300">
            🧠 Insight: Your sales are{" "}
            <span className="text-cyan-300 font-semibold">
              {total > 1000 ? "growing steadily" : "still building momentum"}
            </span>
            . Focus on customer retention for better consistency.
          </p>
        </div>

        {/* LINE CHART */}
        <ChartCard title="Sales Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1f2937",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="sale"
                stroke="#22d3ee"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* BAR + PIE */}
        <div className="grid md:grid-cols-2 gap-6">

          <ChartCard title="Daily Comparison">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid stroke="#1f2937" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1f2937",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="sale" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={90} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1f2937",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analytics;

/* ================= UI COMPONENTS ================= */

const KPI = ({ title, value }: any) => {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <p className="text-xs text-slate-400">{title}</p>
      <h2 className="text-xl font-bold text-cyan-300 mt-1">
        {value}
      </h2>
    </div>
  );
};

const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
      <h3 className="text-sm text-slate-300 mb-3">{title}</h3>
      {children}
    </div>
  );
};