import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

/* ================= TYPES ================= */

interface ITransaction {
  id: string;
  customer: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  date: string;
}

/* ================= MOCK DATA ================= */

const mockData: ITransaction[] = [
  {
    id: "TXN-001",
    customer: "Ali Khan",
    type: "CREDIT",
    amount: 1000,
    date: "2026-04-10",
  },
  {
    id: "TXN-002",
    customer: "Ali Khan",
    type: "DEBIT",
    amount: 400,
    date: "2026-04-11",
  },
  {
    id: "TXN-003",
    customer: "Usman Tariq",
    type: "CREDIT",
    amount: 2000,
    date: "2026-04-12",
  },
];

/* ================= COMPONENT ================= */

function Ledger() {
  const [search, setSearch] = useState("");

  const filtered = mockData.filter((t) =>
    t.customer.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= CALCULATIONS ================= */

  let totalCredit = 0;
  let totalDebit = 0;

  filtered.forEach((t) => {
    if (t.type === "CREDIT") totalCredit += t.amount;
    else totalDebit += t.amount;
  });

  const balance = totalCredit - totalDebit;

  return (
    <DashboardLayout>
      <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Ledger
            </h1>
            <p className="text-gray-500">
              Track customer balances and transactions
            </p>
          </div>

          <button className="bg-[#1A9899] text-white px-5 py-2 rounded-xl shadow hover:opacity-90 transition">
            + Add Entry
          </button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border w-full md:w-1/3 outline-none focus:ring-2 focus:ring-[#1A9899]"
        />

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card title="Total Credit" value={`Rs ${totalCredit}`} color="green" />

          <Card title="Total Debit" value={`Rs ${totalDebit}`} color="red" />

          <Card
            title="Balance"
            value={`Rs ${balance}`}
            color={balance >= 0 ? "blue" : "red"}
          />

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Balance</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t, index) => {
                // running balance
                let runningBalance = 0;
                for (let i = 0; i <= index; i++) {
                  runningBalance +=
                    filtered[i].type === "CREDIT"
                      ? filtered[i].amount
                      : -filtered[i].amount;
                }

                return (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{t.id}</td>
                    <td className="p-4">{t.customer}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                          ${
                            t.type === "CREDIT"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                      >
                        {t.type}
                      </span>
                    </td>

                    <td className="p-4 font-semibold">
                      Rs {t.amount}
                    </td>

                    <td className="p-4">{t.date}</td>

                    <td className="p-4 font-bold">
                      Rs {runningBalance}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center p-6 text-gray-500">
              No transactions found
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

/* ================= CARD ================= */

const Card = ({ title, value, color }: any) => {
  const map: any = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${map[color]}`}>
        {value}
      </h2>
    </div>
  );
};

export default Ledger;