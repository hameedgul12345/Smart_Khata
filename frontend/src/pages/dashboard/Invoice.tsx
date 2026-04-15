import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

/* ================= TYPES ================= */

interface IInvoice {
  id: string;
  customer: string;
  amount: number;
  date: string;
  status: "PAID" | "PENDING";
}

/* ================= MOCK DATA ================= */

const mockInvoices: IInvoice[] = [
  {
    id: "INV-001",
    customer: "Ali Khan",
    amount: 1200,
    date: "2026-04-10",
    status: "PAID",
  },
  {
    id: "INV-002",
    customer: "Usman Tariq",
    amount: 850,
    date: "2026-04-12",
    status: "PENDING",
  },
  {
    id: "INV-003",
    customer: "Ahmed Raza",
    amount: 2300,
    date: "2026-04-13",
    status: "PAID",
  },
];

/* ================= COMPONENT ================= */

function Invoice() {
  const [search, setSearch] = useState("");

  const filtered = mockInvoices.filter((inv) =>
    inv.customer.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <DashboardLayout>
      <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Invoices
            </h1>
            <p className="text-gray-500">
              Manage your billing and payments
            </p>
          </div>

          <button className="bg-[#1A9899] text-white px-5 py-2 rounded-xl shadow hover:opacity-90 transition">
            + New Invoice
          </button>
        </div>

        {/* SEARCH + TOTAL */}
        <div className="flex flex-col md:flex-row justify-between gap-4">

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl border w-full md:w-1/3 outline-none focus:ring-2 focus:ring-[#1A9899]"
          />

          <div className="bg-white px-6 py-3 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Total</p>
            <h2 className="text-xl font-bold">Rs {total}</h2>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{inv.id}</td>

                  <td className="p-4">{inv.customer}</td>

                  <td className="p-4 font-semibold">
                    Rs {inv.amount}
                  </td>

                  <td className="p-4">{inv.date}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          inv.status === "PAID"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center p-6 text-gray-500">
              No invoices found
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Invoice;