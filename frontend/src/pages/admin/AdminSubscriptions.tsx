import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);

  // ✅ Dummy Data
  const dummySubscriptions = [
    {
      _id: "1",
      user: { name: "Ali Khan" },
      plan: "pro",
      price: 20,
      billingCycle: "monthly",
      startDate: "2025-04-01",
      expiryDate: "2025-05-01",
      status: "active",
    },
    {
      _id: "2",
      user: { name: "Ahmed Raza" },
      plan: "basic",
      price: 10,
      billingCycle: "monthly",
      startDate: "2025-03-15",
      expiryDate: "2025-04-15",
      status: "cancelled",
    },
    {
      _id: "3",
      user: { name: "Sara Malik" },
      plan: "free",
      price: 0,
      billingCycle: "none",
      startDate: "2025-01-01",
      expiryDate: "2025-12-31",
      status: "active",
    },
  ];

  // ✅ Load Dummy Data
  useEffect(() => {
    setSubscriptions(dummySubscriptions);
  }, []);

  // ✅ Toggle status (Active / Cancelled)
  const toggleStatus = (id) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub._id === id
          ? {
              ...sub,
              status: sub.status === "active" ? "cancelled" : "active",
            }
          : sub
      )
    );
  };

  // ✅ Plan Badge
  const getPlanBadge = (plan) => (
    <span
      className={`px-2 py-1 rounded-full text-white text-sm ${
        plan === "pro"
          ? "bg-purple-500"
          : plan === "basic"
          ? "bg-yellow-500"
          : "bg-gray-400"
      }`}
    >
      {plan}
    </span>
  );

  // ✅ Status Badge
  const getStatusBadge = (status) => (
    <span
      className={`px-2 py-1 rounded-full text-white text-sm ${
        status === "active"
          ? "bg-green-500"
          : status === "cancelled"
          ? "bg-red-500"
          : "bg-gray-400"
      }`}
    >
      {status}
    </span>
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Plan</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Billing</th>
              <th className="px-6 py-3 text-left">Start</th>
              <th className="px-6 py-3 text-left">Expiry</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{sub.user?.name}</td>

                  <td className="px-6 py-4">
                    {getPlanBadge(sub.plan)}
                  </td>

                  <td className="px-6 py-4">${sub.price}</td>

                  <td className="px-6 py-4">{sub.billingCycle}</td>

                  <td className="px-6 py-4">
                    {new Date(sub.startDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(sub.expiryDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(sub.status)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={sub.status === "active"}
                        onCheckedChange={() => toggleStatus(sub._id)}
                      />
                      <Label>
                        {sub.status === "active"
                          ? "Active"
                          : "Cancelled"}
                      </Label>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminSubscriptions;