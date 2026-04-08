import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { serverUrl } from "@/App";
import type { User } from "@/redux/slices/userSlice"; // ✅ reuse your type

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch users
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get<{ users: User[] }>(
          `${serverUrl}/api/user/admin/users`
        );
        setUsers(res.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  // ✅ Toggle Active/Blocked
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`${serverUrl}/api/user/${id}/status`, {
        isActive: !currentStatus,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? { ...user, isActive: !currentStatus }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // ✅ Toggle Approval (based on your structure, using subscriptionStatus)
  const toggleApproval = async (
    id: string,
    currentStatus: User["subscriptionStatus"]
  ) => {
    try {
      const newStatus =
        currentStatus === "active" ? "expired" : "active";

      await axios.put(`${serverUrl}/api/user/${id}/approval`, {
        subscriptionStatus: newStatus,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? { ...user, subscriptionStatus: newStatus }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating approval:", error);
    }
  };

  // ✅ Role badge
  const getRoleBadge = (role: User["role"]) => (
    <span
      className={`px-2 py-1 rounded-full text-white text-sm ${
        role === "admin" ? "bg-blue-500" : "bg-gray-500"
      }`}
    >
      {role}
    </span>
  );

  // ✅ Plan badge
  const getPlanBadge = (plan: User["plan"]) => (
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

  // ✅ Loading UI
  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-10">Loading users...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Profile</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Plan</th>
              <th className="px-6 py-3 text-left">Subscription</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50"
                >
                  {/* Profile */}
                  <td className="px-6 py-4">
                    <img
                      src={
                        user.profilePicture ||
                        "https://via.placeholder.com/40"
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">{user.name}</td>

                  {/* Email */}
                  <td className="px-6 py-4">{user.email}</td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>

                  {/* Active / Block */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={() =>
                          toggleStatus(user._id, user.isActive)
                        }
                      />
                      <Label>
                        {user.isActive ? "Active" : "Blocked"}
                      </Label>
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="px-6 py-4">
                    {getPlanBadge(user.plan)}
                  </td>

                  {/* Subscription */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.subscriptionStatus === "active"}
                        onCheckedChange={() =>
                          toggleApproval(
                            user._id,
                            user.subscriptionStatus
                          )
                        }
                      />
                      <Label>
                        {user.subscriptionStatus}
                      </Label>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;