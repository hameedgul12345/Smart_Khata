import { useState, type ChangeEvent } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import axios from "axios";
import { setUser } from "../../redux/slices/userSlice";
import { motion } from "framer-motion";
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

  const user = useAppSelector((state: RootState) => state.user.user) as User | null;

  // -------------------- States --------------------
  const [name, setName] = useState(user?.name ?? "");
  const [shopName, setShopName] = useState(user?.shopName ?? "");
  const [profileFile, setProfileFile] = useState<File | null>(null); // actual file
  const [profilePreview, setProfilePreview] = useState<string | undefined>(user?.profilePicture); // preview
  const [loading, setLoading] = useState(false);

  // -------------------- Handlers --------------------
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileFile(file);

      const reader = new FileReader();
      reader.onload = (event) => setProfilePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("shopName", shopName);
      if (profileFile) formData.append("profilePicture", profileFile);

      const res = await axios.put(`${serverUrl}/api/user/update-profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch(setUser(res.data));
      setProfilePreview(res.data.profilePicture); // update preview
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#1A9999] px-6 py-8 text-white flex items-center gap-4">
            <div className="relative">
              <motion.img
                src={profilePreview || `https://ui-avatars.com/api/?name=${user?.name}`}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
                whileHover={{ scale: 1.1 }}
              />
              <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer border">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 16l4-4m0 0l4 4m-4-4V4"
                  />
                </svg>
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">My Profile</h2>
              <p className="text-sm text-blue-100">{user?.email}</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </motion.div>

            {/* Shop Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                placeholder="Enter your shop name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#1A9999] text-white font-semibold hover:bg-[#1A9999] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Updating Profile..." : "Save Changes"}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Profile;
