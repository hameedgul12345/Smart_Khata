"use client";

import { useState, type ChangeEvent } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import axios from "axios";
import { setUser } from "../../redux/slices/userSlice";
import { motion } from "framer-motion";
import {
  Camera,
  Mail,
  Store,
  User as UserIcon,
} from "lucide-react";
import { serverUrl } from "../../App";

/* -------------------- Types -------------------- */

interface User {
  _id: string;
  name: string;
  email: string;
  shopName?: string;
  profilePicture?: string;
}

/* -------------------- Component -------------------- */

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(
    (state: RootState) => state.user.user
  ) as User | null;

  const [name, setName] = useState(user?.name ?? "");
  const [shopName, setShopName] = useState(
    user?.shopName ?? ""
  );

  const [profileFile, setProfileFile] =
    useState<File | null>(null);

  const [profilePreview, setProfilePreview] = useState<
    string | undefined
  >(user?.profilePicture);

  const [loading, setLoading] = useState(false);

  /* IMAGE CHANGE */

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setProfileFile(file);

      const reader = new FileReader();

      reader.onload = (event) =>
        setProfilePreview(
          event.target?.result as string
        );

      reader.readAsDataURL(file);
    }
  };

  /* UPDATE */

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("shopName", shopName);

      if (profileFile) {
        formData.append(
          "profilePicture",
          profileFile
        );
      }

      const res = await axios.put(
        `${serverUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      dispatch(setUser(res.data));

      setProfilePreview(
        res.data.profilePicture
      );

      alert("Profile updated successfully ✅");
    } catch (error) {
      console.error(error);

      alert("Profile update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#050816] text-white p-4 md:p-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >

          {/* MAIN CARD */}

          <div
            className="
            rounded-3xl overflow-hidden
            border border-white/10
            bg-white/5 backdrop-blur-xl
            shadow-2xl shadow-cyan-500/5
            "
          >

            {/* HEADER */}

            <div
              className="
              relative px-6 md:px-10 py-10
              bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10
              border-b border-white/10
              "
            >

              {/* GLOW */}

              <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

              <div className="relative flex flex-col md:flex-row md:items-center gap-6">

                {/* PROFILE IMAGE */}

                <div className="relative group w-fit">

                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={
                      profilePreview ||
                      `https://ui-avatars.com/api/?name=${user?.name}`
                    }
                    alt="Profile"
                    className="
                    w-28 h-28 rounded-full
                    object-cover
                    border-4 border-cyan-500/30
                    shadow-xl shadow-cyan-500/20
                    "
                  />

                  {/* UPLOAD */}

                  <label
                    className="
                    absolute bottom-1 right-1
                    w-10 h-10 rounded-full
                    bg-cyan-500 hover:bg-cyan-400
                    flex items-center justify-center
                    cursor-pointer
                    transition-all duration-300
                    shadow-lg
                    "
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />

                    <Camera size={18} />
                  </label>
                </div>

                {/* USER INFO */}

                <div className="space-y-2">

                  <h1
                    className="
                    text-3xl font-bold
                    bg-gradient-to-r from-cyan-400 to-blue-500
                    text-transparent bg-clip-text
                    "
                  >
                    My Profile
                  </h1>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail size={16} />
                    <span>{user?.email}</span>
                  </div>

                  <p className="text-slate-400 text-sm">
                    Manage your personal profile and business information
                  </p>
                </div>
              </div>
            </div>

            {/* FORM */}

            <div className="p-6 md:p-10 space-y-8">

              {/* GRID */}

              <div className="grid md:grid-cols-2 gap-6">

                {/* NAME */}

                <div>
                  <label
                    className="
                    text-sm font-medium
                    text-slate-300
                    flex items-center gap-2
                    "
                  >
                    <UserIcon size={16} />
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    className="
                    mt-2 w-full px-4 py-3
                    rounded-2xl
                    bg-white/5
                    border border-white/10
                    text-white
                    placeholder:text-slate-500
                    outline-none
                    transition-all duration-300
                    focus:border-cyan-500/40
                    focus:ring-2 focus:ring-cyan-500/20
                    "
                  />
                </div>

                {/* SHOP */}

                <div>
                  <label
                    className="
                    text-sm font-medium
                    text-slate-300
                    flex items-center gap-2
                    "
                  >
                    <Store size={16} />
                    Shop Name
                  </label>

                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) =>
                      setShopName(e.target.value)
                    }
                    placeholder="Enter shop name"
                    className="
                    mt-2 w-full px-4 py-3
                    rounded-2xl
                    bg-white/5
                    border border-white/10
                    text-white
                    placeholder:text-slate-500
                    outline-none
                    transition-all duration-300
                    focus:border-cyan-500/40
                    focus:ring-2 focus:ring-cyan-500/20
                    "
                  />
                </div>
              </div>

              {/* BUTTON */}

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="
                w-full md:w-auto
                px-8 py-3 rounded-2xl
                font-semibold
                bg-gradient-to-r from-cyan-500 to-blue-600
                hover:scale-[1.02]
                hover:shadow-lg hover:shadow-cyan-500/30
                transition-all duration-300
                disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {loading
                  ? "Updating Profile..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;