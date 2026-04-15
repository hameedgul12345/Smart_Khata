import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

/* ================= COMPONENT ================= */

function Setting() {
  const [tab, setTab] = useState("profile");

  return (
    <DashboardLayout>
      <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen flex gap-6">

        {/* SIDEBAR */}
        <div className="w-64 bg-white rounded-2xl shadow-sm p-4 space-y-2">

          {["profile", "security", "business", "preferences"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`w-full text-left px-4 py-2 rounded-lg capitalize transition ${
                tab === t
                  ? "bg-[#1A9899] text-white"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}

        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm p-6">

          {tab === "profile" && <Profile />}
          {tab === "security" && <Security />}
          {tab === "business" && <Business />}
          {tab === "preferences" && <Preferences />}

        </div>

      </div>
    </DashboardLayout>
  );
}

/* ================= PROFILE ================= */

const Profile = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Profile</h2>

    <Input label="Full Name" placeholder="Enter your name" />
    <Input label="Email" placeholder="Enter your email" />
    <Input label="Phone" placeholder="Enter phone number" />

    <button className="bg-[#1A9899] text-white px-5 py-2 rounded-xl">
      Save Changes
    </button>
  </div>
);

/* ================= SECURITY ================= */

const Security = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Security</h2>

    <Input label="Current Password" type="password" />
    <Input label="New Password" type="password" />
    <Input label="Confirm Password" type="password" />

    <button className="bg-red-500 text-white px-5 py-2 rounded-xl">
      Update Password
    </button>
  </div>
);

/* ================= BUSINESS ================= */

const Business = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Business Info</h2>

    <Input label="Business Name" placeholder="Your company name" />
    <Input label="Address" placeholder="Your address" />
    <Input label="NTN / Tax ID" placeholder="Optional" />

    <button className="bg-[#1A9899] text-white px-5 py-2 rounded-xl">
      Save Business Info
    </button>
  </div>
);

/* ================= PREFERENCES ================= */

const Preferences = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Preferences</h2>

    <Toggle label="Enable Notifications" />
    <Toggle label="Dark Mode" />
    <Toggle label="Auto Backup Data" />
  </div>
);

/* ================= INPUT ================= */

const Input = ({
  label,
  placeholder,
  type = "text",
}: any) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full mt-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#1A9899]"
    />
  </div>
);

/* ================= TOGGLE ================= */

const Toggle = ({ label }: any) => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-700">{label}</span>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-[#1A9899]" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
            enabled ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default Setting;