import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/* ================= TYPE ================= */
type Store = {
  _id: string;
  name: string;
  owner: string;
  category: string;
  status: "active" | "blocked";
  createdAt: string;
};

function AdminStores() {
  const [stores, setStores] = useState<Store[]>([]); // ✅ FIXED

  // ✅ Dummy Stores Data
  const dummyStores: Store[] = [
    {
      _id: "1",
      name: "Tech World",
      owner: "Ali Khan",
      category: "Electronics",
      status: "active",
      createdAt: "2025-03-01",
    },
    {
      _id: "2",
      name: "Fashion Hub",
      owner: "Sara Malik",
      category: "Clothing",
      status: "blocked",
      createdAt: "2025-02-15",
    },
    {
      _id: "3",
      name: "Grocery Mart",
      owner: "Ahmed Raza",
      category: "Grocery",
      status: "active",
      createdAt: "2025-01-20",
    },
  ];

  // ✅ Load Dummy Data
  useEffect(() => {
    setStores(dummyStores);
  }, []);

  // ✅ Toggle Store Status
  const toggleStatus = (id: string) => {
    setStores((prev) =>
      prev.map((store) =>
        store._id === id
          ? {
              ...store,
              status: store.status === "active" ? "blocked" : "active",
            }
          : store
      )
    );
  };

  // ✅ Status Badge
  const getStatusBadge = (status: Store["status"]) => (
    <span
      className={`px-2 py-1 rounded-full text-white text-sm ${
        status === "active" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {status}
    </span>
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Stores</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Store Name</th>
              <th className="px-6 py-3 text-left">Owner</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Created</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No stores found
                </td>
              </tr>
            ) : (
              stores.map((store) => (
                <tr
                  key={store._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{store.name}</td>
                  <td className="px-6 py-4">{store.owner}</td>
                  <td className="px-6 py-4">{store.category}</td>

                  <td className="px-6 py-4">
                    {new Date(store.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(store.status)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={store.status === "active"}
                        onCheckedChange={() =>
                          toggleStatus(store._id)
                        }
                      />
                      <Label>
                        {store.status === "active"
                          ? "Active"
                          : "Blocked"}
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

export default AdminStores;