"use client";

import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  User,
  Shield,
  Building2,
  Settings2,
  Moon,
  Bell,
  Database,
} from "lucide-react";

/* ================= COMPONENT ================= */

function Setting() {
  const [tab, setTab] = useState("profile");

  const tabs = [
    {
      key: "profile",
      label: "Profile",
      icon: <User size={18} />,
    },
    {
      key: "security",
      label: "Security",
      icon: <Shield size={18} />,
    },
    {
      key: "business",
      label: "Business",
      icon: <Building2 size={18} />,
    },
    {
      key: "preferences",
      label: "Preferences",
      icon: <Settings2 size={18} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#050816] text-white p-4 md:p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Settings
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your account preferences and business settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* SIDEBAR */}
          <div className="h-fit rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">

            <div className="space-y-2">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-medium ${
                    tab === t.key
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-white shadow-lg shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-cyan-400">
                    {t.icon}
                  </span>

                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">

            {tab === "profile" && <Profile />}
            {tab === "security" && <Security />}
            {tab === "business" && <Business />}
            {tab === "preferences" && <Preferences />}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ================= PROFILE ================= */

const Profile = () => (
  <div className="space-y-6">

    <div>
      <h2 className="text-2xl font-bold text-white">
        Profile Settings
      </h2>

      <p className="text-slate-400 mt-1">
        Update your personal information
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      <Input
        label="Full Name"
        placeholder="Enter your full name"
      />

      <Input
        label="Email Address"
        placeholder="Enter your email"
        type="email"
      />

      <Input
        label="Phone Number"
        placeholder="Enter your phone"
      />

      <Input
        label="Username"
        placeholder="Choose username"
      />
    </div>

    <button
      className="
      px-6 py-3 rounded-2xl font-medium
      bg-gradient-to-r from-cyan-500 to-blue-600
      hover:scale-[1.02] transition-all duration-300
      shadow-lg shadow-cyan-500/20
      "
    >
      Save Changes
    </button>
  </div>
);

/* ================= SECURITY ================= */

const Security = () => (
  <div className="space-y-6">

    <div>
      <h2 className="text-2xl font-bold text-white">
        Security
      </h2>

      <p className="text-slate-400 mt-1">
        Change password and secure your account
      </p>
    </div>

    <div className="space-y-5">
      <Input
        label="Current Password"
        type="password"
        placeholder="••••••••"
      />

      <Input
        label="New Password"
        type="password"
        placeholder="••••••••"
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
      />
    </div>

    <button
      className="
      px-6 py-3 rounded-2xl font-medium
      bg-red-500/20 border border-red-500/30
      text-red-400 hover:bg-red-500/30
      transition-all duration-300
      "
    >
      Update Password
    </button>
  </div>
);

/* ================= BUSINESS ================= */

const Business = () => (
  <div className="space-y-6">

    <div>
      <h2 className="text-2xl font-bold text-white">
        Business Information
      </h2>

      <p className="text-slate-400 mt-1">
        Manage your company details
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      <Input
        label="Business Name"
        placeholder="Your company name"
      />

      <Input
        label="Tax / NTN ID"
        placeholder="Optional"
      />

      <div className="md:col-span-2">
        <Input
          label="Business Address"
          placeholder="Enter address"
        />
      </div>
    </div>

    <button
      className="
      px-6 py-3 rounded-2xl font-medium
      bg-gradient-to-r from-cyan-500 to-blue-600
      hover:scale-[1.02] transition-all duration-300
      shadow-lg shadow-cyan-500/20
      "
    >
      Save Business Info
    </button>
  </div>
);

/* ================= PREFERENCES ================= */

const Preferences = () => (
  <div className="space-y-8">

    <div>
      <h2 className="text-2xl font-bold text-white">
        Preferences
      </h2>

      <p className="text-slate-400 mt-1">
        Customize your dashboard experience
      </p>
    </div>

    <div className="space-y-5">

      <Toggle
        icon={<Bell size={18} />}
        label="Enable Notifications"
        desc="Receive important updates and alerts"
      />

      <Toggle
        icon={<Moon size={18} />}
        label="Dark Mode"
        desc="Use dark appearance for dashboard"
        defaultEnabled
      />

      <Toggle
        icon={<Database size={18} />}
        label="Auto Backup"
        desc="Automatically backup your data"
      />

    </div>
  </div>
);

/* ================= INPUT ================= */

interface InputProps {
  label: string;
  placeholder?: string;
  type?: string;
}

const Input = ({
  label,
  placeholder,
  type = "text",
}: InputProps) => (
  <div>

    <label className="text-sm font-medium text-slate-300">
      {label}
    </label>

    <input
      type={type}
      placeholder={placeholder}
      className="
      w-full mt-2 px-4 py-3 rounded-2xl
      bg-white/5 border border-white/10
      text-white placeholder:text-slate-500
      outline-none transition-all duration-300
      focus:border-cyan-500/50
      focus:ring-2 focus:ring-cyan-500/20
      "
    />
  </div>
);

/* ================= TOGGLE ================= */

interface ToggleProps {
  label: string;
  desc: string;
  icon: React.ReactNode;
  defaultEnabled?: boolean;
}

const Toggle = ({
  label,
  desc,
  icon,
  defaultEnabled = false,
}: ToggleProps) => {
  const [enabled, setEnabled] = useState(defaultEnabled);

  return (
    <div
      className="
      flex items-center justify-between
      rounded-2xl border border-white/10
      bg-white/5 px-5 py-4
      "
    >

      <div className="flex items-center gap-4">

        <div
          className="
          w-11 h-11 rounded-xl
          bg-cyan-500/10 border border-cyan-500/20
          flex items-center justify-center
          text-cyan-400
          "
        >
          {icon}
        </div>

        <div>
          <h4 className="font-medium text-white">
            {label}
          </h4>

          <p className="text-sm text-slate-400">
            {desc}
          </p>
        </div>
      </div>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`
          relative w-14 h-7 rounded-full transition-all duration-300
          ${enabled
            ? "bg-gradient-to-r from-cyan-500 to-blue-600"
            : "bg-slate-700"
          }
        `}
      >
        <div
          className={`
            absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300
            ${enabled ? "translate-x-8" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
};

export default Setting;