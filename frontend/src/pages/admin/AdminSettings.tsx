import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/* ================= TYPE ================= */
type Settings = {
  siteName: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultPlan: "free" | "basic" | "pro";
  emailNotifications: boolean;
};

function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteName: "My SaaS Platform",
    maintenanceMode: false,
    allowRegistration: true,
    defaultPlan: "free",
    emailNotifications: true,
  });

  // ✅ Toggle boolean settings safely
  const toggleSetting = (key: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]:
        typeof prev[key] === "boolean"
          ? !prev[key]
          : prev[key], // prevent string toggle error
    }));
  };

  // ✅ Input change (typed)
  const handleSiteNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings((prev) => ({
      ...prev,
      siteName: e.target.value,
    }));
  };

  // ✅ Select change (typed)
  const handlePlanChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSettings((prev) => ({
      ...prev,
      defaultPlan: e.target.value as Settings["defaultPlan"],
    }));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">

        {/* Site Name */}
        <div>
          <Label className="block mb-2">Site Name</Label>
          <input
            type="text"
            value={settings.siteName}
            onChange={handleSiteNameChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Default Plan */}
        <div>
          <Label className="block mb-2">Default User Plan</Label>
          <select
            value={settings.defaultPlan}
            onChange={handlePlanChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
          </select>
        </div>

        {/* Maintenance Mode */}
        <div className="flex items-center justify-between">
          <Label>Maintenance Mode</Label>
          <Switch
            checked={settings.maintenanceMode}
            onCheckedChange={() => toggleSetting("maintenanceMode")}
          />
        </div>

        {/* Allow Registration */}
        <div className="flex items-center justify-between">
          <Label>Allow User Registration</Label>
          <Switch
            checked={settings.allowRegistration}
            onCheckedChange={() => toggleSetting("allowRegistration")}
          />
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <Label>Email Notifications</Label>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={() => toggleSetting("emailNotifications")}
          />
        </div>

        {/* Save Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Save Settings
        </button>

      </div>
    </AdminLayout>
  );
}

export default AdminSettings;